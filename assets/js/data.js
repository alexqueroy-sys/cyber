"use strict";
/*
 * Contenu de la feuille de route, tiré du document
 * « Feuille de route cybersécurité 2026-2028 » (13 octobre 2026),
 * complété par des recherches sur les sites officiels (14 octobre 2026).
 *
 * Nom de l'employeur affiché dans le site. Le site est publié anonymisé :
 * pour afficher le vrai nom, remplace la valeur (par exemple "la société X").
 */
const EMPLOYEUR = "ton employeur";
const DEFAULT_START = "2026-10-13";
const CHECKED_ON = "14 octobre 2026";

const L = {
  thm: ["TryHackMe", "https://tryhackme.com"],
  rootme: ["Root-Me", "https://www.root-me.org"],
  hackropole: ["Hackropole (ANSSI)", "https://hackropole.fr"],
  bandit: ["OverTheWire Bandit", "https://overthewire.org/wargames/bandit/"],
  otw: ["OverTheWire", "https://overthewire.org/wargames/"],
  portswigger: ["PortSwigger Web Security Academy", "https://portswigger.net/web-security"],
  owasp: ["OWASP Top 10", "https://owasp.org/www-project-top-ten/"],
  htb: ["Hack The Box", "https://www.hackthebox.com"],
  htbAcademy: ["HTB Academy", "https://academy.hackthebox.com"],
  cyberdefenders: ["CyberDefenders", "https://cyberdefenders.org"],
  anssi: ["Guides de l'ANSSI (cyber.gouv.fr)", "https://cyber.gouv.fr"],
  netacad: ["Cisco Networking Academy", "https://www.netacad.com"],
  mslearn: ["Microsoft Learn", "https://learn.microsoft.com/training/"],
  wireshark: ["Wireshark", "https://www.wireshark.org"],
  virtualbox: ["VirtualBox", "https://www.virtualbox.org"],
  debian: ["Debian", "https://www.debian.org"],
  obsidian: ["Obsidian", "https://obsidian.md"],
  github: ["GitHub", "https://github.com"],
  goad: ["GOAD (Orange Cyberdefense)", "https://github.com/Orange-Cyberdefense/GOAD"],
  wazuh: ["Wazuh", "https://wazuh.com"],
  splunk: ["Splunk", "https://www.splunk.com"],
  sysmon: ["Sysmon (Microsoft)", "https://learn.microsoft.com/sysinternals/downloads/sysmon"],
  attack: ["MITRE ATT&CK", "https://attack.mitre.org"],
  hashcat: ["Hashcat", "https://hashcat.net/hashcat/"],
  tlcl: ["The Linux Command Line (gratuit)", "https://linuxcommand.org/tlcl.php"],
  mseval: ["Centre d'évaluation Microsoft", "https://www.microsoft.com/evalcenter"],
  ine: ["INE (eJPT)", "https://ine.com/security/certifications/ejpt-certification"],
  centri: ["Centri (BTL1)", "https://www.centri.org"],
  tcm: ["TCM Security (PNPT)", "https://certifications.tcm-sec.com/pnpt/"],
  offsec: ["OffSec (OSCP+)", "https://www.offsec.com/courses/pen-200/"],
  fcsc: ["FCSC (ANSSI)", "https://www.france-cybersecurity-challenge.fr"],
  ctf404: ["404CTF", "https://www.404ctf.fr"],
  ctftime: ["CTFtime", "https://ctftime.org"],
  lehack: ["leHACK", "https://lehack.org"],
  sstic: ["SSTIC", "https://www.sstic.org"],
  ywh: ["YesWeHack", "https://www.yeswehack.com"],
};
const R = (...keys) => keys.map((k) => ({ label: L[k][0], url: L[k][1] }));

/* ───────────── Parcours : grandes étapes (actions) et petites étapes (subtasks) ───────────── */

const PHASES = [
  {
    id: "s0",
    name: "Démarrage",
    period: "Semaine 1",
    desc: "Tes 5 actions de cette semaine : comptes, lab, première lecture, contact avec la sécurité et planning.",
    goal: "Tout est prêt pour pratiquer chaque semaine.",
  },
  {
    id: "p1",
    name: "Phase 1 · Les fondations",
    short: "Les fondations",
    period: "Mois 1 à 6",
    desc: "Les bases avant les outils : Linux, réseau, Windows/AD, scripting, web, crypto.",
    goal: "Expliquer sans notes DNS, TCP, HTTP, TLS et Kerberos ; 300 points Root-Me ; 5 articles publiés.",
  },
  {
    id: "p2",
    name: "Phase 2 · Première spécialisation et première certification",
    short: "1re spécialisation et 1re certification",
    period: "Mois 7 à 12",
    desc: "Défense (SIEM), attaque AD dans ton lab, puis une certification pratique : eJPT ou BTL1.",
    goal: "Une certification pratique obtenue ; 800 points Root-Me ; 10 write-ups.",
  },
  {
    id: "p3",
    name: "Phase 3 · Spécialisation et crédibilité",
    short: "Spécialisation et crédibilité",
    period: "Mois 12 à 24",
    desc: "Choix de filière, master en alternance, deuxième certification, compétitions et visibilité.",
    goal: "2 certifications pratiques ; un portfolio de 20 contenus ; un master en alternance en équipe sécurité.",
  },
];

const THEMES = [
  "Organisation", "Linux", "Réseau", "Windows/AD", "Scripting", "Systèmes", "Web",
  "Crypto", "Défense", "Offensif", "Cloud", "Certification", "Communauté", "Carrière",
];

const PRIORITIES = {
  critique: { label: "Critique", rank: 0, hint: "Indispensable, à faire en premier" },
  haute: { label: "Haute", rank: 1, hint: "Cœur du plan" },
  normale: { label: "Normale", rank: 2, hint: "Important, mais peut glisser un peu" },
  optionnelle: { label: "Facultatif", rank: 3, hint: "Facultatif, selon ton temps et ton budget. N'apparaît jamais comme prochaine étape." },
};

/*
 * Grandes étapes.
 * months : [début, fin] en mois depuis la date de départ (0 = semaine 1).
 * subtasks : les petites étapes, dans l'ordre où les faire. L'ordre sert
 * d'identifiant : ajoute les nouvelles à la fin pour ne pas décaler celles déjà cochées.
 */
const ACTIONS = [
  // ───────────── Démarrage ─────────────
  {
    id: "s0-comptes", phase: "s0", months: [0, 0], theme: "Organisation", priority: "critique",
    title: "Créer tes comptes de pratique et lancer Bandit",
    why: "Tu vas pratiquer chaque semaine sur des plateformes légales. Autant que tout soit prêt dès le premier jour.",
    how: [
      "Crée ton compte TryHackMe et vérifie la réduction étudiante (environ 100 $ par an, le seul abonnement payant de la première année).",
      "Crée tes comptes Root-Me et Hackropole (gratuits, en français).",
      "Lance OverTheWire Bandit : connexion SSH au niveau 0, puis avance à ton rythme.",
    ],
    subtasks: ["Créer ton compte TryHackMe (vérifier la réduction étudiante)", "Créer ton compte Root-Me", "Créer ton compte Hackropole", "Réussir le niveau 0 de Bandit"],
    resources: R("thm", "rootme", "hackropole", "bandit"),
  },
  {
    id: "s0-lab", phase: "s0", months: [0, 0], theme: "Organisation", priority: "critique",
    title: "Installer VirtualBox, une VM Debian et ton fichier de notes",
    why: "Le homelab est ton terrain d'entraînement légal, et tes notes sont la base de ton portfolio.",
    how: [
      "Installe VirtualBox (ou VMware Workstation, gratuit aussi).",
      "Crée une VM Debian serveur, sans interface graphique.",
      "Ouvre un fichier de notes : Obsidian, ou du Markdown versionné sur GitHub.",
    ],
    subtasks: ["Installer VirtualBox", "Installer une VM Debian serveur", "Créer ton fichier de notes (Obsidian ou Markdown sur GitHub)"],
    resources: R("virtualbox", "debian", "obsidian", "github"),
  },
  {
    id: "s0-hygiene", phase: "s0", months: [0, 0], theme: "Windows/AD", priority: "critique",
    title: "Lire le Guide d'hygiène informatique de l'ANSSI",
    why: "42 mesures concrètes, directement liées à ton poste. Tu verras ton périmètre avec un œil sécurité.",
    how: [
      "Télécharge le Guide d'hygiène informatique sur cyber.gouv.fr.",
      "Pour chaque mesure, note si elle est déjà appliquée dans ton périmètre, sans rien modifier toi-même.",
    ],
    subtasks: ["Lire le guide (42 mesures)", "Lister les mesures déjà appliquées dans ton périmètre"],
    resources: R("anssi"),
  },
  {
    id: "s0-tuteur", phase: "s0", months: [0, 0], theme: "Carrière", priority: "critique",
    title: "Demander à ton tuteur 30 minutes avec l'équipe sécurité",
    why: "Le premier contact avec la sécurité ouvre la porte aux missions et à ton futur master en alternance.",
    how: [
      "Prépare une question précise, pas un « je veux faire de la cyber ».",
      "Demande à ton tuteur de te présenter quelqu'un de l'équipe sécurité, pour 30 minutes.",
      "Note ce que tu as appris et les pistes évoquées.",
    ],
    subtasks: ["Préparer une question précise", "Faire la demande à ton tuteur", "Faire l'échange et le noter"],
    resources: [],
  },
  {
    id: "s0-planning", phase: "s0", months: [0, 0], theme: "Organisation", priority: "critique",
    title: "Bloquer tes créneaux hebdomadaires et noter tes objectifs CTF",
    why: "8 à 10 h par semaine en plus de l'alternance et du bachelor, c'est beaucoup. Sans créneaux fixes, ça ne tient pas sur 24 mois.",
    how: [
      "Bloque dans ton agenda : 2 soirées de 1 h 30, 1 soirée d'1 h, le samedi matin (3-4 h).",
      "Prévois 20 minutes de veille par jour, par exemple dans les transports.",
      "Note le FCSC 2027 (printemps) et le 404CTF 2027 comme objectifs.",
    ],
    subtasks: ["Bloquer tes créneaux dans l'agenda", "Noter le FCSC 2027 comme objectif", "Noter le 404CTF 2027 comme objectif"],
    resources: R("fcsc", "ctf404"),
  },

  // ───────────── Phase 1 ─────────────
  {
    id: "p1-linux", phase: "p1", months: [1, 1], theme: "Linux", priority: "critique",
    title: "Linux : maîtriser la ligne de commande",
    why: "Serveurs, outils de sécurité et machines de CTF tournent sous Linux.",
    how: [
      "Travaille shell, droits, processus, services, journaux, SSH et cron.",
      "Avance sur Bandit et le parcours Pre-Security de TryHackMe.",
      "Administre ta VM Debian uniquement en SSH, sans interface.",
      "Écris une note avec tes propres mots pour chaque notion.",
    ],
    subtasks: ["Finir Bandit niveaux 0 à 10", "Finir Bandit niveaux 11 à 20", "Terminer TryHackMe Pre-Security", "Administrer ta VM Debian sans interface (SSH, services, cron, journaux)"],
    resources: R("bandit", "thm", "tlcl"),
  },
  {
    id: "p1-reseau", phase: "p1", months: [2, 2], theme: "Réseau", priority: "critique",
    title: "Réseau TCP/IP : lire et expliquer le trafic",
    why: "Toute attaque et toute détection passent par le réseau. Les débutants qui plafonnent ont souvent sauté cette étape.",
    how: [
      "Couvre OSI, IP, routage, TCP/UDP, DNS, DHCP, HTTP/TLS, VLAN, NAT et pare-feu.",
      "Fais les modules de fondamentaux réseau sur TryHackMe.",
      "Capture ton propre trafic avec Wireshark et explique chaque échange dans tes notes.",
    ],
    subtasks: ["Terminer les fondamentaux réseau sur TryHackMe", "Analyser 5 captures Wireshark dans tes notes", "Analyser 5 captures de plus (10 au total)", "Savoir expliquer un handshake TCP, une résolution DNS et une connexion TLS"],
    resources: R("thm", "wireshark", "netacad"),
  },
  {
    id: "p1-ad", phase: "p1", months: [3, 3], theme: "Windows/AD", priority: "critique",
    title: "Windows et Active Directory : monter ton domaine",
    why: "Cœur des SI d'entreprise et cible n°1 des rançongiciels. C'est ton avantage grâce à ton poste.",
    how: [
      "Lis les Recommandations de sécurité relatives à Active Directory de l'ANSSI.",
      "Monte un domaine à la main : Windows Server en évaluation (180 jours) + un client Windows.",
      "Étudie GPO, Kerberos/NTLM, ACL, LAPS, les journaux et PowerShell.",
      "Comprends le Kerberoasting et sa détection (événement 4769).",
    ],
    subtasks: ["Lire les recommandations ANSSI sur l'AD", "Installer Windows Server (évaluation) et un client Windows", "Monter ton domaine AD à la main", "Savoir expliquer Kerberos", "Comprendre le Kerberoasting et sa détection (4769)"],
    resources: R("anssi", "mseval"),
  },
  {
    id: "p1-sc900", phase: "p1", months: [3, 6], theme: "Certification", priority: "optionnelle", cert: "sc900",
    title: "Microsoft SC-900",
    why: "Faible seule, mais cohérente en environnement Microsoft. QCM facile.",
    how: [
      "Suis le parcours gratuit SC-900 sur Microsoft Learn.",
      "Ne la passe que si elle est financée ou si tu as du budget : elle n'est pas indispensable.",
    ],
    subtasks: ["Suivre le parcours Microsoft Learn SC-900", "Passer l'examen"],
    resources: R("mslearn"),
  },
  {
    id: "p1-script", phase: "p1", months: [4, 4], theme: "Scripting", priority: "haute",
    title: "Scripting : publier 3 scripts utiles",
    why: "Automatiser, parser des logs, écrire des outils : c'est ce qui distingue un profil technique.",
    how: [
      "Python : un parseur de logs.",
      "PowerShell : un inventaire de postes, testé dans ton lab.",
      "Bash : un script d'administration pour ta VM Debian.",
      "Publie-les sur GitHub avec un README clair.",
    ],
    subtasks: ["Publier un parseur de logs en Python", "Publier un inventaire de postes en PowerShell", "Publier un script Bash d'administration"],
    resources: R("github"),
  },
  {
    id: "p1-web", phase: "p1", months: [5, 5], theme: "Web", priority: "haute",
    title: "Web : OWASP Top 10 et premiers labs",
    why: "Première surface d'attaque exposée, base de l'AppSec et du bug bounty.",
    how: [
      "Comprends HTTP et les sessions.",
      "Étudie les injections SQL, XSS, le contrôle d'accès et la SSRF.",
      "Enchaîne les labs « Apprentice » de PortSwigger.",
      "Fais les challenges Web-Serveur de Root-Me.",
    ],
    subtasks: ["Faire 10 labs PortSwigger Apprentice", "Faire 10 labs de plus (20 au total)", "Faire 15 challenges Web-Serveur sur Root-Me"],
    resources: R("portswigger", "owasp", "rootme"),
  },
  {
    id: "p1-crypto", phase: "p1", months: [5, 6], theme: "Crypto", priority: "normale",
    title: "Cryptographie appliquée",
    why: "Mots de passe, certificats, signatures : il y en a partout.",
    how: [
      "Revois les hash, le chiffrement symétrique et asymétrique, la PKI et TLS.",
      "Inspecte la chaîne de certification d'un site depuis ton navigateur.",
      "Casse un hash faible avec Hashcat, dans ton lab uniquement.",
    ],
    subtasks: ["Savoir expliquer une chaîne de certification", "Casser un hash faible avec Hashcat dans ton lab"],
    resources: R("hashcat"),
  },
  {
    id: "p1-synthese", phase: "p1", months: [6, 6], theme: "Organisation", priority: "haute",
    title: "Synthèse du 6e mois",
    why: "Consolider et rendre visible ce que tu as appris.",
    how: [
      "Termine le parcours Cyber Security 101 de TryHackMe.",
      "Atteins 300 points sur Root-Me.",
      "Publie 5 articles sur ton blog ou ton GitHub (write-ups autorisés, documentation de lab, scripts).",
    ],
    subtasks: ["Terminer Cyber Security 101 sur TryHackMe", "Atteindre 300 points sur Root-Me", "Publier 5 articles sur ton blog ou GitHub"],
    resources: R("thm", "rootme"),
  },
  {
    id: "p1-check", phase: "p1", months: [6, 6], theme: "Organisation", priority: "critique",
    title: "Point de contrôle : expliquer sans notes",
    why: "Si au 6e mois tu ne sais pas expliquer un échange DNS ou Kerberos sans notes, ralentis et consolide avant la phase 2.",
    how: [
      "Explique à voix haute, ou à quelqu'un, ce qui se passe quand tu tapes une adresse dans ton navigateur (DNS, TCP, HTTP, TLS).",
      "Explique une authentification Kerberos.",
      "Si tu bloques, reprends la notion avant d'avancer.",
    ],
    subtasks: ["Expliquer DNS → TCP → HTTP → TLS sans notes", "Expliquer Kerberos sans notes"],
    resources: [],
  },

  // ───────────── Phase 2 ─────────────
  {
    id: "p2-siem", phase: "p2", months: [7, 8], theme: "Défense", priority: "haute",
    title: "Défense : SIEM, journaux Windows et MITRE ATT&CK",
    why: "Les postes juniors les plus nombreux sont en SOC. La boucle « attaque ton lab, vérifie ce que tu détectes, corrige » fait les profils d'exception.",
    how: [
      "Installe Wazuh ou Splunk Free, et Sysmon sur tes machines Windows.",
      "Lance une attaque dans ton lab, regarde ce qui remonte, puis améliore la détection.",
      "Rattache chaque détection à une technique MITRE ATT&CK.",
      "Commence le parcours SOC Level 1 de TryHackMe.",
    ],
    subtasks: ["Installer Wazuh ou Splunk dans ton lab", "Installer Sysmon sur tes machines Windows", "Détecter et documenter une première attaque", "Détecter et documenter 2 attaques de plus", "Commencer SOC Level 1 sur TryHackMe"],
    resources: R("wazuh", "splunk", "sysmon", "attack", "thm"),
  },
  {
    id: "p2-systemes", phase: "p2", months: [7, 9], theme: "Systèmes", priority: "normale",
    title: "Systèmes : élévation de privilèges Linux et Windows",
    why: "Base de l'élévation de privilèges, du forensic et de l'analyse de malware. L'assembleur viendra plus tard.",
    how: [
      "Revois la mémoire, les processus et la virtualisation.",
      "Linux : abus de SUID et de sudo.",
      "Windows : services mal configurés.",
    ],
    subtasks: ["Comprendre l'élévation de privilèges Linux (SUID, sudo)", "Comprendre l'élévation de privilèges Windows (services mal configurés)"],
    resources: R("thm", "rootme"),
  },
  {
    id: "p2-goad", phase: "p2", months: [8, 9], theme: "Offensif", priority: "haute",
    title: "Attaque AD dans ton lab avec GOAD",
    why: "Comprendre les attaques AD courantes, et surtout savoir les détecter.",
    how: [
      "Installe GOAD : MINILAB ou GOAD-Mini avec environ 16 Go de RAM, GOAD-Light avec environ 32 Go.",
      "Pratique le Kerberoasting, l'AS-REP roasting et les abus d'ACL.",
      "Pour chaque attaque, écris la détection correspondante dans ton SIEM.",
      "Le lab n'est jamais exposé sur Internet.",
    ],
    subtasks: ["Installer GOAD", "Kerberoasting : l'exécuter et le détecter", "AS-REP roasting : l'exécuter et le détecter", "Abus d'ACL : les exécuter et les détecter"],
    resources: R("goad"),
  },
  {
    id: "p2-event", phase: "p2", months: [8, 9], theme: "Communauté", priority: "normale",
    title: "Aller à leHACK ou au SSTIC",
    why: "leHACK (fin juin, Cité des sciences, Paris) est le premier événement à faire. Le SSTIC (début juin, Rennes) est la conférence technique de référence.",
    how: [
      "Réserve ta place dès l'ouverture de la billetterie.",
      "Repère à l'avance les talks et les ateliers qui t'intéressent.",
      "Va parler aux gens : stands, communautés, recruteurs.",
    ],
    subtasks: ["Réserver ta place", "Aller à l'événement"],
    resources: R("lehack", "sstic"),
  },
  {
    id: "p2-cert", phase: "p2", months: [9, 11], theme: "Certification", priority: "critique", certs: ["ejpt", "btl1", "thm"],
    title: "Première certification pratique : eJPT ou BTL1",
    why: "Les certifications accélèrent, elles ne remplacent pas la pratique. C'est la seule à payer de ta poche en 24 mois.",
    how: [
      "Choisis selon ton penchant : eJPT (offensif) ou BTL1 (défensif). Compare-les dans Feuille de route → Certifications.",
      "Astuce budget : attends les soldes du Black Friday.",
      "Vérifie le prix sur le site officiel avant d'acheter.",
    ],
    subtasks: ["Choisir entre eJPT et BTL1", "Acheter la formation et l'examen", "Terminer la formation", "Réussir l'examen"],
    resources: R("ine", "centri"),
  },
  {
    id: "p2-bilan", phase: "p2", months: [12, 12], theme: "Organisation", priority: "critique",
    title: "Bilan du 12e mois",
    why: "Le jalon de la première année.",
    how: ["Fais le point sur chaque jalon, et ajuste le rythme de la phase 3 si besoin."],
    subtasks: ["Avoir ta certification pratique", "Atteindre 800 points sur Root-Me", "Finir la moitié des labs PortSwigger Apprentice", "Publier 10 write-ups", "Avoir fait leHACK ou le SSTIC"],
    resources: [],
  },

  // ───────────── Phase 3 ─────────────
  {
    id: "p3-filiere", phase: "p3", months: [12, 14], theme: "Carrière", priority: "critique",
    title: "Choisir ta filière",
    why: "Après 12 mois de socle défensif et AD, avec l'offensif en loisir, c'est le moment de choisir ta spécialité.",
    how: [
      "Pentest / red team si tu prends plus de plaisir à attaquer.",
      "SOC / DFIR si c'est l'investigation qui te passionne.",
      "GRC si tu préfères le pilotage (très demandée dans la banque, à cause de DORA).",
    ],
    subtasks: ["Choisir ta filière"],
    resources: [],
  },
  {
    id: "p3-master", phase: "p3", months: [12, 14], theme: "Carrière", priority: "critique",
    title: "Admission dans un master cyber en alternance (SecNumedu)",
    why: "L'étape la plus rentable après le bachelor : elle valide le bac+5 et te donne une expérience cyber réelle, financée par l'entreprise.",
    how: [
      "Liste les formations labellisées SecNumedu, et vérifie la date d'expiration de chaque label.",
      "Compare : rythme compatible avec un poste en équipe sécurité, taux d'insertion, CTF et asso cyber, coût (universitaire ou privé).",
      `Vise une alternance dans une équipe sécurité de ${EMPLOYEUR}, de l'ACPR ou d'une autre banque.`,
    ],
    subtasks: ["Lister les masters SecNumedu qui te plaisent", "Envoyer tes candidatures", "Obtenir une admission", "Trouver une alternance en équipe sécurité"],
    resources: R("anssi"),
  },
  {
    id: "p3-approf", phase: "p3", months: [13, 18], theme: "Offensif", priority: "haute",
    title: "Approfondir ta filière",
    why: "Construire une vraie profondeur dans la spécialité choisie. Passe les petites étapes qui ne sont pas de ta filière.",
    how: [
      "Offensif : 20 machines HTB, l'Academy AD, puis le PNPT ou le CPTS.",
      "Défensif : CyberDefenders, forensic Windows et mémoire.",
      "GRC : EBIOS RM, ISO 27001, DORA.",
    ],
    subtasks: ["Offensif : 10 machines HTB", "Offensif : 10 machines HTB de plus (20 au total)", "Offensif : terminer l'Academy AD", "Défensif : investigations CyberDefenders", "Défensif : forensic Windows et mémoire", "GRC : EBIOS RM, ISO 27001 et DORA"],
    resources: R("htb", "htbAcademy", "cyberdefenders"),
  },
  {
    id: "p3-cloud", phase: "p3", months: [13, 18], theme: "Cloud", priority: "normale",
    title: "Cloud : identités hybrides AD ↔ Entra ID",
    why: "Les SI migrent vers Entra ID et le cloud hybride.",
    how: [
      "Comprends la synchronisation des identités entre AD et Entra ID.",
      "Étudie les erreurs IAM classiques (Azure, AWS).",
      "Plus tard, en filière cloud : la SC-500, qui remplace l'AZ-500 depuis le 31 août 2026.",
    ],
    subtasks: ["Comprendre les identités hybrides AD ↔ Entra ID", "Étudier les erreurs IAM classiques"],
    resources: R("mslearn"),
  },
  {
    id: "p3-cert2", phase: "p3", months: [15, 20], theme: "Certification", priority: "haute", certs: ["pnpt", "cpts", "cdsa", "iso27001", "ebios"],
    title: "Deuxième certification pratique",
    why: "Objectif à 24 mois : 2 certifications pratiques. Fais-la financer, idéalement par ton employeur ou ton alternance.",
    how: [
      "Offensif : PNPT ou HTB CPTS.",
      "Défensif : HTB CDSA, ou un homelab SIEM bien documenté.",
      "GRC : ISO 27001 Lead Implementer ou EBIOS RM.",
      "Compare-les dans Feuille de route → Certifications.",
    ],
    subtasks: ["Choisir ta deuxième certification", "Obtenir le financement", "Réussir l'examen"],
    resources: R("tcm", "htbAcademy"),
  },
  {
    id: "p3-ctf", phase: "p3", months: [16, 17], theme: "Communauté", priority: "haute",
    title: "Compétitions : FCSC et 404CTF en équipe",
    why: "Le FCSC (ANSSI) a un classement 14-25 ans dont tu fais partie. Le 404CTF est très adapté aux débutants.",
    how: [
      "Entraîne-toi sur les archives du FCSC sur Hackropole.",
      "Monte ou rejoins une équipe pour le 404CTF.",
      "À noter : le document place cette étape aux mois 16-17, mais le FCSC 2027 (printemps) et le 404CTF 2027 (mai-juin) tombent plus tôt. Participe en 2027 pour l'expérience, puis vise le top 25 % l'année suivante.",
    ],
    subtasks: ["Participer au FCSC 2027", "Faire le 404CTF 2027 en équipe", "Viser le top 25 % junior au FCSC"],
    resources: R("fcsc", "ctf404", "hackropole", "ctftime"),
  },
  {
    id: "p3-bugbounty", phase: "p3", months: [14, 24], theme: "Offensif", priority: "optionnelle",
    title: "Bug bounty (si offensif)",
    why: "Ce n'est pas une source de revenus pour un débutant. Commence après 9 à 12 mois de pratique du web, et ne teste que le périmètre autorisé.",
    how: [
      "Entraîne-toi sur le Dojo de YesWeHack.",
      "Lis entièrement le périmètre du programme avant de tester quoi que ce soit.",
      "Rédige des rapports clairs et reproductibles.",
    ],
    subtasks: ["Commencer le Dojo YesWeHack", "Envoyer ton premier rapport"],
    resources: R("ywh"),
  },
  {
    id: "p3-visibilite", phase: "p3", months: [18, 24], theme: "Communauté", priority: "normale",
    title: "Visibilité : talk et open source",
    why: "Le junior qui a des preuves s'en sort très bien sur un marché « en sablier ».",
    how: [
      "Propose un talk en meetup (OWASP France, communautés locales).",
      "Contribue à l'open source : règles Sigma, outils.",
    ],
    subtasks: ["Donner un talk en meetup", "Faire une contribution open source (règles Sigma, outil)"],
    resources: [],
  },
  {
    id: "p3-bilan", phase: "p3", months: [24, 24], theme: "Organisation", priority: "critique",
    title: "Bilan des 24 mois",
    why: "La fin de la feuille de route.",
    how: ["Fais le point, mets à jour ton CV et ton portfolio, et prépare la suite (OSCP+ financée par l'employeur)."],
    subtasks: ["Avoir 2 certifications pratiques", "Avoir un portfolio de 20 contenus", "Être en master en alternance en équipe sécurité", "Préparer l'OSCP+, financée par ton employeur"],
    resources: R("offsec"),
  },
];

/* Les 9 fondamentaux, dans l'ordre (section 1 du document). */
const FUNDAMENTALS = [
  { n: 1, name: "Réseau TCP/IP", detail: "OSI, IP, routage, TCP/UDP, DNS, DHCP, HTTP/TLS, VLAN, NAT, pare-feu", why: "Toute attaque et toute détection passent par le réseau", goal: "Lire une capture Wireshark et expliquer un handshake TCP, une résolution DNS, une connexion TLS", action: "p1-reseau" },
  { n: 2, name: "Linux", detail: "Shell, droits, processus, services, journaux, SSH, cron", why: "Serveurs, outils de sécurité et machines de CTF tournent sous Linux", goal: "Administrer une VM Debian sans interface ; finir OverTheWire Bandit", action: "p1-linux" },
  { n: 3, name: "Windows et Active Directory", detail: "GPO, Kerberos/NTLM, ACL, LAPS, journaux, PowerShell", why: "Cœur des SI d'entreprise et cible n°1 des rançongiciels. Ton avantage grâce à ton poste", goal: "Monter un domaine chez toi, expliquer Kerberos, comprendre le Kerberoasting et sa détection (4769)", action: "p1-ad" },
  { n: 4, name: "Scripting", detail: "Python, Bash, PowerShell", why: "Automatiser, parser des logs, écrire des outils", goal: "Un parseur de logs en Python, un inventaire de postes en PowerShell", action: "p1-script" },
  { n: 5, name: "Systèmes", detail: "Mémoire, processus, virtualisation, assembleur plus tard", why: "Élévation de privilèges, forensic, malware", goal: "Comprendre une élévation de privilèges Linux (SUID, sudo) et Windows (services mal configurés)", action: "p2-systemes" },
  { n: 6, name: "Web", detail: "HTTP, sessions, OWASP Top 10 : injections SQL, XSS, contrôle d'accès, SSRF", why: "Première surface d'attaque exposée, base de l'AppSec et du bug bounty", goal: "Labs « Apprentice » de PortSwigger sur les principales vulnérabilités", action: "p1-web" },
  { n: 7, name: "Cryptographie appliquée", detail: "Hash, symétrique/asymétrique, PKI, TLS", why: "Mots de passe, certificats, signatures : partout", goal: "Expliquer une chaîne de certification ; casser un hash faible avec Hashcat dans ton lab", action: "p1-crypto" },
  { n: 8, name: "Bases défensives", detail: "SIEM, EDR, logs, MITRE ATT&CK, incidents", why: "Les postes juniors les plus nombreux sont en SOC", goal: "Wazuh ou Splunk Free dans ton lab, détecter une attaque que tu as lancée", action: "p2-siem" },
  { n: 9, name: "Cloud", detail: "Azure/Entra ID, AWS IAM", why: "Les SI migrent vers Entra ID et le cloud hybride", goal: "Comprendre les identités hybrides AD ↔ Entra ID et les erreurs IAM classiques", action: "p3-cloud" },
];

/* ───────────── Sites ───────────── */

const SITE_GROUPS = [
  { id: "debuter", name: "S'entraîner en étant guidé", desc: "Pour démarrer : des parcours pas à pas et des challenges classés par difficulté." },
  { id: "labs", name: "Labs et challenges plus avancés", desc: "Moins guidés, plus proches du réel. À partir de la phase 2." },
  { id: "defense", name: "Défense et SOC", desc: "Investigations, analyse de journaux, réponse à incident." },
  { id: "cours", name: "Cours et théorie", desc: "Les bases théoriques, souvent gratuites." },
  { id: "references", name: "Références et outils", desc: "À garder en favori : tu y reviendras sans arrêt." },
  { id: "veille", name: "Veille", desc: "20 minutes par jour pour rester à jour." },
];

/* doc : true si le site vient du document, false s'il a été ajouté. */
const SITES = [
  { group: "debuter", name: "TryHackMe", url: "https://tryhackme.com", what: "Parcours guidés dans le navigateur : Pre-Security, Cyber Security 101, SOC Level 1, Jr Penetration Tester.", price: "Gratuit en partie · Premium ~10 $/mois en annuel, tarif étudiant", lang: "EN", when: "Dès maintenant", doc: true },
  { group: "debuter", name: "Root-Me", url: "https://www.root-me.org", what: "600+ challenges en 11 catégories (web, réseau, crypto, forensic…). Ton classement est une preuve visible.", price: "Gratuit", lang: "FR", when: "Dès maintenant (challenges à 5 et 10 points)", doc: true },
  { group: "debuter", name: "Hackropole (ANSSI)", url: "https://hackropole.fr", what: "620+ challenges des archives du FCSC, avec leurs solutions.", price: "Gratuit", lang: "FR", when: "Préparation au FCSC", doc: true },
  { group: "debuter", name: "OverTheWire", url: "https://overthewire.org/wargames/", what: "Wargames en ligne de commande : Bandit pour Linux, Natas pour le web.", price: "Gratuit", lang: "EN", when: "Premier mois", doc: true },
  { group: "debuter", name: "picoCTF", url: "https://picoctf.org", what: "CTF pour débutants créé par l'université Carnegie Mellon, avec des centaines de challenges en accès permanent.", price: "Gratuit", lang: "EN", when: "Dès maintenant, en complément de Root-Me", doc: false },

  { group: "labs", name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", what: "La référence en sécurité web : cours et labs sur chaque vulnérabilité (Apprentice → Expert).", price: "Gratuit", lang: "EN", when: "À partir du 4e mois", doc: true },
  { group: "labs", name: "Hack The Box (Labs)", url: "https://www.hackthebox.com", what: "Machines à attaquer sans guide. Starting Point pour débuter, machines retirées avec corrigés en VIP.", price: "Gratuit en partie · VIP payant", lang: "EN", when: "À partir du 9e mois", doc: true },
  { group: "labs", name: "HTB Academy", url: "https://academy.hackthebox.com", what: "Cours très complets (excellents sur l'AD), qui préparent aux certifications CPTS et CDSA.", price: "Student : 8 $/mois (e-mail d'école requis) · Silver : 30 $/mois", lang: "EN", when: "Phase 2 et 3", doc: true },
  { group: "labs", name: "pwn.college", url: "https://pwn.college", what: "Cours de l'université d'Arizona sur les systèmes et l'exploitation binaire, dans le navigateur.", price: "Gratuit", lang: "EN", when: "Après la phase 1, si le bas niveau t'intéresse", doc: false },
  { group: "labs", name: "CryptoHack", url: "https://cryptohack.org", what: "Challenges de cryptographie qui apprennent les maths en les cassant.", price: "Gratuit", lang: "EN", when: "Avec l'étape Crypto", doc: false },
  { group: "labs", name: "CTFtime", url: "https://ctftime.org", what: "Le calendrier de tous les CTF du monde, les classements et les write-ups.", price: "Gratuit", lang: "EN", when: "Pour trouver des CTF en équipe", doc: true },

  { group: "defense", name: "LetsDefend", url: "https://letsdefend.io", what: "Simulateur de SOC : alertes à trier dans un SIEM, parcours SOC Analyst.", price: "Gratuit en partie · Premium payant", lang: "EN", when: "Phase 2 (défense)", doc: true },
  { group: "defense", name: "Blue Team Labs Online", url: "https://blueteamlabs.online", what: "Investigations pratiques : analyse de journaux, de mails de phishing, de mémoire.", price: "Gratuit en partie", lang: "EN", when: "Filière défensive", doc: true },
  { group: "defense", name: "CyberDefenders", url: "https://cyberdefenders.org", what: "Enquêtes SOC et DFIR sur de vraies traces (réseau, disque, mémoire).", price: "Gratuit en partie", lang: "EN", when: "Filière défensive", doc: true },

  { group: "cours", name: "Cisco Networking Academy", url: "https://www.netacad.com", what: "Cours réseau gratuits, jusqu'à la préparation du CCNA.", price: "Gratuit", lang: "FR / EN", when: "Mois 2 (réseau)", doc: true },
  { group: "cours", name: "Microsoft Learn", url: "https://learn.microsoft.com/training/", what: "Cours officiels gratuits sur Windows, Entra ID, Azure, et les parcours SC-900 et SC-500.", price: "Gratuit", lang: "FR", when: "Mois 3 (AD) et cloud", doc: true },
  { group: "cours", name: "Guides de l'ANSSI", url: "https://cyber.gouv.fr", what: "Guide d'hygiène informatique (42 mesures), recommandations AD et journalisation Windows.", price: "Gratuit", lang: "FR", when: "Semaine 1 et mois 3", doc: true },
  { group: "cours", name: "Professor Messer", url: "https://www.professormesser.com", what: "Cours vidéo complets pour Security+ et Network+.", price: "Gratuit (notes payantes)", lang: "EN", when: "Si tu prépares Security+", doc: false },
  { group: "cours", name: "Jeremy's IT Lab", url: "https://www.youtube.com/@JeremysITLab", what: "Cours vidéo CCNA complet, avec des labs Packet Tracer.", price: "Gratuit", lang: "EN", when: "Mois 2, si tu veux aller loin en réseau", doc: false },
  { group: "cours", name: "TCM Security Academy", url: "https://academy.tcm-sec.com", what: "Cours pratiques de pentest (Practical Ethical Hacking…), qui préparent au PNPT.", price: "Quelques cours gratuits · reste payant", lang: "EN", when: "Phase 3 (offensif)", doc: false },

  { group: "references", name: "MITRE ATT&CK", url: "https://attack.mitre.org", what: "La base des techniques d'attaque réelles, pour décrire et détecter les attaques.", price: "Gratuit", lang: "EN", when: "Phase 2 (défense)", doc: true },
  { group: "references", name: "HackTricks", url: "https://book.hacktricks.wiki", what: "Wiki des techniques de pentest : énumération, élévation de privilèges, AD, web.", price: "Gratuit", lang: "EN", when: "Pendant les labs et CTF", doc: false },
  { group: "references", name: "GTFOBins", url: "https://gtfobins.github.io", what: "Comment détourner les binaires Unix pour élever ses privilèges.", price: "Gratuit", lang: "EN", when: "Étape Systèmes", doc: false },
  { group: "references", name: "PayloadsAllTheThings", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", what: "Recueil de charges utiles pour le web et l'AD.", price: "Gratuit", lang: "EN", when: "Étape Web et labs", doc: false },
  { group: "references", name: "CyberChef", url: "https://gchq.github.io/CyberChef/", what: "Décoder, encoder, déchiffrer et analyser des données dans le navigateur.", price: "Gratuit", lang: "EN", when: "CTF et analyse", doc: false },

  { group: "veille", name: "CERT-FR", url: "https://www.cert.ssi.gouv.fr", what: "Alertes et avis de sécurité officiels français.", price: "Gratuit", lang: "FR", when: "Chaque jour", doc: true },
  { group: "veille", name: "NoLimitSecu", url: "https://www.nolimitsecu.fr", what: "Podcast français sur la cybersécurité.", price: "Gratuit", lang: "FR", when: "Chaque semaine", doc: true },
  { group: "veille", name: "tl;dr sec", url: "https://tldrsec.com", what: "Newsletter hebdomadaire : outils, articles et talks sélectionnés.", price: "Gratuit", lang: "EN", when: "Chaque semaine", doc: true },
  { group: "veille", name: "SANS NewsBites", url: "https://www.sans.org/newsletters/newsbites/", what: "Résumé commenté de l'actualité cyber, deux fois par semaine.", price: "Gratuit", lang: "EN", when: "Chaque semaine", doc: true },
];

/* ───────────── Certifications ───────────── */

const CERT_GROUPS = [
  { id: "bases", name: "Bases", desc: "Toutes facultatives. Utiles si elles sont financées, pas indispensables." },
  { id: "premiere", name: "Première certification pratique", desc: "Mois 9 à 12 : une seule, payée de ta poche. Choisis selon que tu préfères attaquer ou défendre." },
  { id: "offensif", name: "Spécialisation offensive", desc: "Mois 15 à 24 et après. À faire financer." },
  { id: "defensif", name: "Spécialisation défensive", desc: "Pour la filière SOC / DFIR." },
  { id: "cloud", name: "Cloud", desc: "Plus tard, en filière cloud." },
  { id: "grc", name: "GRC", desc: "Gouvernance, risques et conformité. Très valorisées dans la banque, à faire financer." },
];

/*
 * Prix et modalités vérifiés le 14 octobre 2026, sur les sites officiels quand
 * c'était possible. Les prix changent souvent : vérifie toujours avant d'acheter.
 */
const CERTS = [
  {
    id: "sc900", group: "bases", name: "SC-900", full: "Microsoft Security, Compliance, and Identity Fundamentals", org: "Microsoft",
    tag: "Facultative", level: "Débutant", when: "Mois 3 à 6, facultatif",
    price: "~76 à 125 € (99 $ aux États-Unis)", priceShort: "~100 €",
    summary: "Les bases de la sécurité dans l'univers Microsoft : identité, Entra ID, conformité.",
    rows: [
      ["Prix", "Environ 76 à 125 € selon les sources (99 $ aux États-Unis). Le prix exact en euros s'affiche au moment de l'inscription. Microsoft propose un tarif étudiant : déclare ton statut d'étudiant dans ton profil Microsoft Learn."],
      ["Où la passer", "En ligne depuis chez toi (surveillance par webcam) ou en centre d'examen, via Pearson VUE. Inscription depuis Microsoft Learn."],
      ["Format", "QCM et questions à choix, environ 45 minutes. Score de réussite : 700 sur 1 000."],
      ["Prérequis", "Aucun."],
      ["Langue", "Disponible en français."],
      ["Validité", "Les certifications « Fundamentals » n'expirent pas."],
      ["Repassage", "Payant. Délai de 24 h après un premier échec."],
      ["Préparation", "Le parcours gratuit SC-900 sur Microsoft Learn suffit."],
      ["Reconnaissance", "Faible seule, mais cohérente en environnement Microsoft."],
    ],
    links: [["Page officielle (Microsoft Learn)", "https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/"]],
    action: "p1-sc900",
  },
  {
    id: "secplus", group: "bases", name: "Security+", full: "CompTIA Security+ (SY0-701)", org: "CompTIA",
    tag: "Facultative", level: "Débutant à intermédiaire", when: "Facultatif, si financée",
    price: "439 $", priceShort: "439 $",
    summary: "La certification généraliste la plus connue au monde. Moins valorisée en France.",
    rows: [
      ["Prix", "439 $ sur la boutique CompTIA (hausse de juin 2026). Les revendeurs agréés la proposent autour de 370 à 395 $."],
      ["Où la passer", "En ligne depuis chez toi ou en centre d'examen, via Pearson VUE."],
      ["Format", "90 questions maximum en 90 minutes : QCM et questions pratiques (simulations). Score de réussite : 750 sur 900."],
      ["Prérequis", "Aucun obligatoire. CompTIA recommande Network+ et 2 ans d'expérience en administration avec un angle sécurité."],
      ["Langue", "Anglais."],
      ["Validité", "3 ans, renouvelable par de la formation continue."],
      ["À savoir", "La version SY0-701 devrait être remplacée en 2027 (date pas encore confirmée par CompTIA)."],
      ["Préparation", "Les vidéos gratuites de Professor Messer, puis des examens blancs."],
      ["Reconnaissance", "Moyenne en France."],
    ],
    links: [["Page officielle (CompTIA)", "https://www.comptia.org/certifications/security"]],
  },
  {
    id: "ccna", group: "bases", name: "CCNA", full: "Cisco Certified Network Associate (200-301 v1.1)", org: "Cisco",
    tag: "Facultative", level: "Intermédiaire", when: "Facultatif",
    price: "300 $ + taxes", priceShort: "300 $",
    summary: "La référence en réseau. Utile si tu veux aller loin côté infrastructure.",
    rows: [
      ["Prix", "300 $ plus taxes, payés en euros à l'inscription."],
      ["Où la passer", "En ligne depuis chez toi ou en centre d'examen, via Pearson VUE."],
      ["Format", "Environ 100 questions en 120 minutes : QCM, glisser-déposer et simulations (configurer ou dépanner des équipements)."],
      ["Prérequis", "Aucun."],
      ["Langue", "Anglais (et japonais)."],
      ["Validité", "3 ans."],
      ["Préparation", "Cisco Networking Academy et le cours vidéo gratuit de Jeremy's IT Lab."],
      ["Reconnaissance", "Bonne pour le réseau et l'infrastructure."],
    ],
    links: [["Page officielle (Cisco)", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html"]],
  },
  {
    id: "ejpt", group: "premiere", name: "eJPT", full: "eLearnSecurity Junior Penetration Tester", org: "INE",
    tag: "Recommandée", level: "Débutant", when: "Mois 9 à 12, si tu penches vers l'offensif",
    price: "~249 $ avec 3 mois de formation", priceShort: "~249 $",
    summary: "La meilleure première certification offensive : un examen 100 % pratique, accessible aux débutants.",
    rows: [
      ["Prix", "Environ 249 $ pour le pack « eJPT + Prep » (3 mois de formation + l'examen), selon plusieurs sources. INE ne l'affiche pas publiquement : vérifie sur ine.com. L'examen demande un abonnement INE et un voucher."],
      ["Ce qui est inclus", "La formation INE (parcours Penetration Testing Student), le voucher et un repassage gratuit."],
      ["Où la passer", "En ligne, depuis chez toi, dans un lab accessible par le navigateur. Pas de surveillance, documents autorisés."],
      ["Format", "Examen pratique sur des scénarios réalistes : environ 35 questions à résoudre en attaquant un réseau, en 48 h. Il faut 70 % au total et un minimum dans chaque domaine."],
      ["Prérequis", "Aucun. Des bases en réseau et en systèmes suffisent."],
      ["Langue", "Anglais."],
      ["Validité", "3 ans, renouvelable."],
      ["Repassage", "Un repassage gratuit, à faire dans les 14 jours. Le voucher expire 180 jours après l'achat : les deux tentatives doivent tenir dans ce délai."],
      ["Préparation", "La formation INE incluse, et le parcours Jr Penetration Tester de TryHackMe."],
      ["Reconnaissance", "Bonne première certification offensive."],
    ],
    links: [["Page officielle (INE)", "https://ine.com/security/certifications/ejpt-certification"]],
    action: "p2-cert",
  },
  {
    id: "btl1", group: "premiere", name: "BTL1", full: "Blue Team Level 1", org: "Centri (ex-Security Blue Team)",
    tag: "Recommandée", level: "Débutant", when: "Mois 9 à 12, si tu penches vers le défensif",
    price: "399 £ (~490 $), formation incluse", priceShort: "399 £",
    summary: "La meilleure première certification défensive : une vraie investigation de 24 h, très appréciée des managers SOC.",
    rows: [
      ["Prix", "399 £ (environ 490 $), formation et examen compris. Pas de réduction individuelle."],
      ["Ce qui est inclus", "La formation en ligne (environ 30 h de cours, 330 leçons), plus de 20 labs dans le navigateur, et 2 tentatives d'examen."],
      ["Où la passer", "En ligne, depuis chez toi. L'organisme s'appelle Centri depuis juin 2026 (centri.org), l'ancien site securityblue.team redirige."],
      ["Format", "Investigation pratique de 24 h sur un environnement compromis (phishing, SIEM, forensic, threat intelligence). Documents autorisés. Il faut environ 70 % pour réussir."],
      ["Prérequis", "Aucun."],
      ["Langue", "Anglais."],
      ["Validité", "N'expire pas."],
      ["Repassage", "2 tentatives incluses."],
      ["Préparation", "La formation incluse, plus TryHackMe SOC Level 1 et Blue Team Labs Online."],
      ["Reconnaissance", "Bonne auprès des managers SOC."],
    ],
    links: [["Site officiel (Centri)", "https://www.centri.org"]],
    action: "p2-cert",
  },
  {
    id: "thm", group: "premiere", name: "SAL1 / PT1", full: "TryHackMe Security Analyst Level 1 / Junior Penetration Tester", org: "TryHackMe",
    tag: "Alternative", level: "Débutant", when: "Alternative à BTL1 ou eJPT",
    price: "349 $ (~301 € en Europe)", priceShort: "349 $",
    summary: "Les certifications de TryHackMe : SAL1 pour le SOC, PT1 pour le pentest. Récentes, encore peu connues.",
    rows: [
      ["Prix", "349 $ chacune (environ 301 € en Europe). Moins cher pour les abonnés Premium."],
      ["Ce qui est inclus", "2 tentatives d'examen."],
      ["Où la passer", "En ligne, dans le navigateur, sans surveillance."],
      ["Format SAL1", "80 QCM en 1 h, puis 2 scénarios dans le simulateur de SOC (2 h chacun). Il faut 750 points sur 1 000."],
      ["Format PT1", "Test d'intrusion pratique sur 48 h, avec un rapport à rédiger."],
      ["Prérequis", "Aucun. Les parcours SOC Level 1 et Jr Penetration Tester de TryHackMe préparent à l'examen."],
      ["Langue", "Anglais."],
      ["Reconnaissance", "Récente, encore limitée."],
    ],
    links: [["Page officielle (TryHackMe)", "https://tryhackme.com/certification/junior-penetration-tester"]],
  },
  {
    id: "pnpt", group: "offensif", name: "PNPT", full: "Practical Network Penetration Tester", org: "TCM Security",
    tag: "Recommandée", level: "Intermédiaire", when: "Mois 15 à 20",
    price: "499 $ avec la formation", priceShort: "499 $",
    summary: "Un vrai test d'intrusion de 5 jours, avec rapport et débrief oral : très proche du métier.",
    rows: [
      ["Prix", "499 $ pour le voucher et la formation."],
      ["Ce qui est inclus", "Plus de 45 h de formation vidéo (12 mois d'accès), le voucher et un repassage gratuit. Repassage supplémentaire : 100 $."],
      ["Où la passer", "En ligne, depuis chez toi, sans surveillance."],
      ["Format", "5 jours pour attaquer un réseau d'entreprise avec Active Directory, 2 jours pour rédiger un rapport professionnel, puis un débrief oral de 15 minutes devant les évaluateurs."],
      ["Prérequis", "Aucun officiellement. TCM conseille de commencer par le PJPT si tu n'as pas d'expérience professionnelle."],
      ["Langue", "Anglais."],
      ["Validité", "N'expire pas. Le voucher est valable 12 mois après l'achat."],
      ["Préparation", "Les cours inclus (Practical Ethical Hacking, OSINT, Windows/Linux privesc) et le lab GOAD."],
      ["Reconnaissance", "Bonne et en hausse."],
    ],
    links: [["Page officielle (TCM Security)", "https://certifications.tcm-sec.com/pnpt/"]],
    action: "p3-cert2",
  },
  {
    id: "cpts", group: "offensif", name: "HTB CPTS", full: "HTB Certified Penetration Testing Specialist", org: "Hack The Box",
    tag: "Alternative", level: "Avancé", when: "Alternative au PNPT",
    price: "~210 $ le voucher, plus HTB Academy", priceShort: "~210 $",
    summary: "Très exigeante et très respectée chez les pentesters. Excellente préparation à l'OSCP+.",
    rows: [
      ["Prix", "Environ 210 $ pour le voucher seul. Il faut aussi un accès HTB Academy : Student à 8 $/mois (e-mail d'école requis), ou Silver annuel à 550 $/an avec 2 vouchers inclus (tarif depuis le 12 octobre 2026)."],
      ["Où la passer", "En ligne, depuis chez toi."],
      ["Format", "10 jours pour mener un test d'intrusion complet, puis un rapport professionnel à rendre dans ce délai."],
      ["Prérequis", "Avoir terminé à 100 % le parcours Penetration Tester de HTB Academy (28 modules)."],
      ["Langue", "Anglais."],
      ["Repassage", "2 tentatives par voucher. Pour avoir droit à la seconde, il faut rendre un rapport même en cas d'échec."],
      ["Préparation", "Le parcours Penetration Tester de HTB Academy, puis des machines HTB."],
      ["Reconnaissance", "Excellente chez les pentesters."],
    ],
    links: [["HTB Academy", "https://academy.hackthebox.com"]],
    action: "p3-cert2",
  },
  {
    id: "oscp", group: "offensif", name: "OSCP+", full: "OffSec Certified Professional+ (PEN-200)", org: "OffSec",
    tag: "Objectif long terme", level: "Avancé", when: "24 mois ou plus, financée par l'employeur",
    price: "1 749 $ (formation + examen)", priceShort: "1 749 $",
    summary: "La plus connue des recruteurs en offensif. À faire financer.",
    rows: [
      ["Prix", "1 749 $ pour le pack formation + examen (90 jours de labs, 1 tentative). Learn One : 2 749 $/an (1 an d'accès, 2 tentatives). Examen seul : 1 699 $."],
      ["Où la passer", "En ligne, depuis chez toi, sous surveillance par un employé d'OffSec."],
      ["Format", "24 h d'examen pratique : 3 machines indépendantes et un ensemble Active Directory de 3 machines. Puis un rapport à rendre dans les 24 h suivantes."],
      ["Prérequis", "Aucun officiellement. Recommandé : bonnes bases TCP/IP, administration Windows et Linux, Bash et Python."],
      ["Langue", "Anglais."],
      ["Validité", "L'OSCP+ expire après 3 ans (l'OSCP de base n'expire pas). Renouvellement par un examen de recertification, une autre certification OffSec ou de la formation continue."],
      ["Préparation", "Le cours PEN-200, plus HTB CPTS ou PNPT avant."],
      ["Reconnaissance", "La plus connue des recruteurs offensifs."],
    ],
    links: [["Page officielle (OffSec)", "https://www.offsec.com/courses/pen-200/"]],
    action: "p3-bilan",
  },
  {
    id: "cdsa", group: "defensif", name: "HTB CDSA", full: "HTB Certified Defensive Security Analyst", org: "Hack The Box",
    tag: "Recommandée", level: "Intermédiaire", when: "Mois 15 à 20, filière défensive",
    price: "~210 $ le voucher, plus HTB Academy", priceShort: "~210 $",
    summary: "L'équivalent défensif du CPTS : une investigation complète avec rapport.",
    rows: [
      ["Prix", "Environ 210 $ pour le voucher seul, plus un accès HTB Academy (Student à 8 $/mois, ou Silver annuel à 550 $/an avec 2 vouchers)."],
      ["Où la passer", "En ligne, depuis chez toi."],
      ["Format", "7 jours d'investigation pratique (SIEM, forensic, analyse de trafic), puis un rapport d'incident."],
      ["Prérequis", "Avoir terminé le parcours SOC Analyst de HTB Academy."],
      ["Langue", "Anglais."],
      ["Repassage", "2 tentatives par voucher."],
      ["Préparation", "Le parcours SOC Analyst de HTB Academy et CyberDefenders."],
      ["Reconnaissance", "Bonne, en hausse dans les SOC."],
    ],
    links: [["HTB Academy", "https://academy.hackthebox.com"]],
    action: "p3-cert2",
  },
  {
    id: "sc500", group: "cloud", name: "SC-500", full: "Microsoft Cloud and AI Security Engineer Associate", org: "Microsoft",
    tag: "Plus tard", level: "Intermédiaire", when: "Plus tard, filière cloud",
    price: "165 $ (prix en euros à l'inscription)", priceShort: "165 $",
    summary: "La certification sécurité cloud de Microsoft, qui remplace l'AZ-500 retirée le 31 août 2026.",
    rows: [
      ["Prix", "165 $ aux États-Unis. Le prix en euros s'affiche à l'inscription, et le tarif étudiant s'applique."],
      ["Où la passer", "En ligne depuis chez toi ou en centre d'examen, via Pearson VUE."],
      ["Format", "Environ 40 à 60 questions (QCM et cas pratiques), autour de 120 minutes. Score de réussite : 700 sur 1 000."],
      ["Prérequis", "Aucun officiellement. Une expérience d'Azure et d'Entra ID est recommandée."],
      ["Validité", "1 an, renouvelable gratuitement chaque année par un test en ligne."],
      ["À savoir", "Disponible depuis le 21 juillet 2026. Environ 80 % du contenu de l'AZ-500, plus la sécurité de l'IA (Copilot, Purview)."],
      ["Préparation", "Les parcours gratuits Microsoft Learn."],
      ["Reconnaissance", "Bonne en sécurité cloud Microsoft."],
    ],
    links: [["Microsoft Learn", "https://learn.microsoft.com/credentials/"]],
  },
  {
    id: "iso27001", group: "grc", name: "ISO 27001 LI / LA", full: "ISO/IEC 27001 Lead Implementer / Lead Auditor", org: "PECB, LSTI…",
    tag: "Si filière GRC", level: "Intermédiaire", when: "Si filière GRC, financée",
    price: "~750 € (e-learning) à ~4 000 € HT (5 jours)", priceShort: "750–4 000 €",
    summary: "Mettre en place (Implementer) ou auditer (Auditor) un système de management de la sécurité selon l'ISO 27001.",
    rows: [
      ["Prix", "Formation de 5 jours avec examen : environ 2 100 à 4 100 € HT selon l'organisme. En e-learning avec examen : autour de 750 € HT. Examen seul chez PECB : environ 1 000 $."],
      ["Où la passer", "Via un organisme de formation partenaire de PECB ou de LSTI, en présentiel ou à distance. L'examen se passe en ligne."],
      ["Format", "Examen de 3 h, environ 80 questions à choix multiples. Il faut 70 %."],
      ["Prérequis", "Aucun pour l'examen. Sans expérience professionnelle, le titre délivré est d'abord un niveau intermédiaire, complété quand l'expérience est acquise."],
      ["Langue", "Français ou anglais."],
      ["Validité", "Frais annuels de maintien de la certification chez PECB."],
      ["Repassage", "Gratuit dans les 12 mois si tu as suivi la formation chez un partenaire, après 15 jours d'attente."],
      ["Reconnaissance", "Très valorisée en GRC."],
    ],
    links: [["PECB", "https://pecb.com"]],
    action: "p3-cert2",
  },
  {
    id: "ebios", group: "grc", name: "EBIOS RM", full: "PECB Certified EBIOS Risk Manager", org: "PECB",
    tag: "Si filière GRC", level: "Intermédiaire", when: "Si filière GRC, financée",
    price: "~600 € (e-learning) à ~2 700 € HT (3 jours)", priceShort: "600–2 700 €",
    summary: "La méthode française d'analyse de risques de l'ANSSI. Incontournable en GRC en France.",
    rows: [
      ["Prix", "Formation de 3 jours avec examen : environ 2 200 à 2 700 € HT. En e-learning avec examen : à partir d'environ 600 €."],
      ["Où la passer", "Via un organisme de formation (certaines formations sont labellisées SecNumedu par l'ANSSI). La certification de personne est délivrée par PECB, pas par l'ANSSI."],
      ["Format", "Examen d'environ 3 h, documents autorisés. Il faut 70 %. Le format exact varie selon les sources : vérifie-le auprès de PECB."],
      ["Prérequis", "Aucun. Le MOOC gratuit EBIOS RM de l'ANSSI est fortement conseillé."],
      ["Langue", "Français."],
      ["Repassage", "Souvent gratuit dans les 12 mois, selon l'organisme."],
      ["Reconnaissance", "Très valorisée en GRC en France."],
    ],
    links: [["Méthode EBIOS RM (ANSSI)", "https://cyber.gouv.fr/la-methode-ebios-risk-manager"]],
    action: "p3-cert2",
  },
];

const WORK_CATEGORIES = [
  "Notes de cours", "Write-up", "Script / outil", "Documentation de lab",
  "Rapport / document", "Certification", "Veille", "Autre",
];
