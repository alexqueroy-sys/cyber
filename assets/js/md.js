"use strict";
/*
 * Mini moteur Markdown, sans dépendance externe.
 * Tout le texte est échappé AVANT la mise en forme : aucun HTML saisi
 * n'est interprété, et seuls les liens http(s) deviennent cliquables.
 */
const MD = (() => {
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function inline(text) {
    let s = esc(text);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => {
      codes.push(c);
      return `\u0000${codes.length - 1}\u0000`;
    });
    // Les liens sont mis de côté pour que la mise en forme ne touche pas aux URL.
    const links = [];
    const link = (u, t) => {
      links.push(`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
      return `\u0001${links.length - 1}\u0001`;
    };
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, t, u) => link(u, t));
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, pre, u) => pre + link(u, u));
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    s = s.replace(/\u0001(\d+)\u0001/g, (_, i) => links[i]);
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
    return s;
  }

  function render(src) {
    const lines = String(src || "").replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      if (/^\s*```/.test(line)) {
        const buf = [];
        i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
        continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }

      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = Math.min(h[1].length + 2, 6);
        out.push(`<h${level}>${inline(h[2])}</h${level}>`);
        i++;
        continue;
      }
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

      if (/^\s*>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
        out.push(`<blockquote>${render(buf.join("\n"))}</blockquote>`);
        continue;
      }

      const ul = /^\s*[-*+]\s+/, ol = /^\s*\d+[.)]\s+/;
      if (ul.test(line) || ol.test(line)) {
        const ordered = ol.test(line);
        const re = ordered ? ol : ul;
        const items = [];
        while (i < lines.length && re.test(lines[i])) {
          let item = lines[i].replace(re, "");
          i++;
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !ul.test(lines[i]) && !ol.test(lines[i])) {
            item += " " + lines[i].trim();
            i++;
          }
          const task = item.match(/^\[([ xX])\]\s+(.*)$/);
          items.push(
            task
              ? `<li class="task"><input type="checkbox" disabled${task[1] !== " " ? " checked" : ""}> ${inline(task[2])}</li>`
              : `<li>${inline(item)}</li>`
          );
        }
        out.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
        continue;
      }

      const buf = [];
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^(#{1,6})\s/.test(lines[i]) &&
        !/^\s*```/.test(lines[i]) &&
        !/^\s*>/.test(lines[i]) &&
        !ul.test(lines[i]) &&
        !ol.test(lines[i])
      ) buf.push(inline(lines[i++]));
      out.push(`<p>${buf.join("<br>")}</p>`);
    }
    return out.join("\n");
  }

  /* Texte brut pour les extraits des cartes. */
  function plain(src) {
    return String(src || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\[[ xX]\]/g, " ")
      .replace(/[#>*_`~-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return { render, plain, esc };
})();
