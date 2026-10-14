"use strict";
/*
 * Contenu de la feuille de route, tiré du document
 * « Feuille de route cybersécurité 2026-2028 » (13 octobre 2026).
 *
 * Nom de l'employeur affiché dans le site. Le site est publié anonymisé :
 * pour afficher le vrai nom, remplace la valeur (par exemple "la société X").
 */
const EMPLOYEUR = "ton employeur";
const DEFAULT_START = "2026-10-13";
const DOC_DATE = "13 octobre 2026";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const L = {
  thm: ["TryHackMe", "https://tryhackme.com"],
  rootme: ["Root-Me", "https://www.root-me.org"],
  hackropole: ["Hackropole (ANSSI)", "https://hackropole.fr"],
  bandit: ["OverTheWire Bandit", "https://overthewire.org/wargames/bandit/"],
  otw: ["OverTheWire (Bandit, Natas)", "https://overthewire.org/wargames/"],
  portswigger: ["PortSwigger Web Security Academy", "https://portswigger.net/web-security"],
  owasp: ["OWASP Top 10", "https://owasp.org/www-project-top-ten/"],
  htb: ["Hack The Box", "https://www.hackthebox.com"],
  htbAcademy: ["HTB Academy", "https://academy.hackthebox.com"],
  btlo: ["Blue Team Labs Online", "https://blueteamlabs.online"],
  cyberdefenders: ["CyberDefenders", "https://cyberdefenders.org"],
  letsdefend: ["LetsDefend", "https://letsdefend.io"],
  anssi: ["Guides de l'ANSSI (cyber.gouv.fr)", "https://cyber.gouv.fr"],
  certfr: ["CERT-FR", "https://www.cert.ssi.gouv.fr"],
  netacad: ["Cisco Networking Academy", "https://www.netacad.com"],
  mslearn: ["Microsoft Learn", "https://learn.microsoft.com/training/"],
  wireshark: ["Wireshark", "https://www.wireshark.org"],
  virtualbox: ["VirtualBox", "https://www.virtualbox.org"],
  debian: ["Debian", "https://www.debian.org"],
  kali: ["Kali Linux", "https://www.kali.org"],
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
  ine: ["INE (eJPT)", "https://ine.com"],
  sbt: ["Security Blue Team (BTL1)", "https://www.securityblue.team"],
  tcm: ["TCM Security (PNPT)", "https://academy.tcm-sec.com"],
  offsec: ["OffSec (OSCP)", "https://www.offsec.com"],
  fcsc: ["FCSC (ANSSI)", "https://www.france-cybersecurity-challenge.fr"],
  ctf404: ["404CTF", "https://www.404ctf.fr"],
  ctftime: ["CTFtime", "https://ctftime.org"],
  lehack: ["leHACK", "https://lehack.org"],
  sstic: ["SSTIC", "https://www.sstic.org"],
  nolimitsecu: ["NoLimitSecu (podcast)", "https://www.nolimitsecu.fr"],
  ywh: ["YesWeHack", "https://www.yeswehack.com"],
  legifrance: ["Légifrance", "https://www.legifrance.gouv.fr"],
  acpr: ["ACPR", "https://acpr.banque-france.fr"],
  tldrsec: ["tl;dr sec", "https://tldrsec.com"],
  sans: ["SANS NewsBites", "https://www.sans.org/newsletters/newsbites/"],
};
const R = (...keys) => keys.map((k) => ({ label: L[k][0], url: L[k][1] }));

/* Groupes d'actions affichés dans la feuille de route, dans cet ordre. */
const PHASES = [
  {
    id: "s0",
    name: "Démarrage",
    period: "Semaine 1",
    desc: "Tes 5 actions de cette semaine : comptes, lab, première lecture, contact avec la sécurité et planning.",
  },
  {
    id: "p1",
    name: "Phase 1 · Les fondations",
    period: "Mois 1 à 6",
    desc: "Les bases avant les outils : Linux, réseau, Windows/AD, scripting, web, crypto.",
  },
  {
    id: "p2",
    name: "Phase 2 · Première spécialisation et première certification",
    period: "Mois 7 à 12",
    desc: "Défense (SIEM), attaque AD dans ton lab, puis une certification pratique : eJPT ou BTL1.",
  },
  {
    id: "p3",
    name: "Phase 3 · Spécialisation et crédibilité",
    period: "Mois 12 à 24",
    desc: "Choix de filière, master en alternance, deuxième certification, compétitions et visibilité.",
  },
  {
    id: "alt",
    name: "Alternance",
    period: "Mois 1 à 12",
    desc: `Utiliser ton poste chez ${EMPLOYEUR} comme un laboratoire défensif encadré, toujours avec l'accord de ta hiérarchie.`,
  },
  {
    id: "hab",
    name: "Habitudes",
    period: "En continu",
    desc: "Ce qui se fait chaque jour, chaque semaine ou chaque mois pendant 24 mois. La régularité bat l'intensité.",
  },
];

const THEMES = [
  "Organisation", "Linux", "Réseau", "Windows/AD", "Scripting", "Systèmes", "Web",
  "Crypto", "Défense", "Offensif", "Cloud", "Certification", "Alternance",
  "Communauté", "Carrière", "Veille",
];

const PRIORITIES = {
  critique: { label: "Critique", rank: 0, hint: "Indispensable, à faire en premier" },
  haute: { label: "Haute", rank: 1, hint: "Cœur du plan" },
  normale: { label: "Normale", rank: 2, hint: "Important, mais peut glisser un peu" },
  optionnelle: { label: "Optionnelle", rank: 3, hint: "Facultatif, selon ton temps et ton budget" },
};

/*
 * Actions suivies dans le tracker.
 * months : [début, fin] en mois depuis la date de départ (0 = semaine 1, null = en continu).
 * subtasks : jalons du document, cochables. L'ordre sert d'identifiant : ajoute
 * les nouveaux jalons à la fin pour ne pas décaler les cases déjà cochées.
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
    subtasks: ["Compte TryHackMe (réduction étudiante vérifiée)", "Compte Root-Me", "Compte Hackropole", "Bandit niveau 0 réussi"],
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
    subtasks: ["VirtualBox installé", "VM Debian installée", "Fichier de notes créé (Obsidian ou Markdown sur GitHub)"],
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
    subtasks: ["Guide lu (42 mesures)", "Liste des mesures déjà appliquées dans ton périmètre"],
    resources: R("anssi"),
  },
  {
    id: "s0-tuteur", phase: "s0", months: [0, 0], theme: "Alternance", priority: "critique",
    title: "Demander à ton tuteur 30 minutes avec l'équipe sécurité",
    why: "Ton alternance est ton meilleur atout. Le premier contact avec la sécurité ouvre la porte aux missions.",
    how: [
      "Prépare une question précise, pas un « je veux faire de la cyber ».",
      "Demande à ton tuteur de te présenter quelqu'un de l'équipe sécurité, pour 30 minutes.",
      "Note ce que tu as appris et les pistes de mission évoquées.",
    ],
    subtasks: ["Question précise préparée", "Demande faite au tuteur", "Échange réalisé et noté"],
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
    subtasks: ["Créneaux bloqués dans l'agenda", "FCSC 2027 noté comme objectif", "404CTF 2027 noté comme objectif"],
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
    subtasks: ["OverTheWire Bandit niveaux 0 à 20", "TryHackMe Pre-Security terminé", "VM Debian administrée sans interface (SSH, services, cron, journaux)"],
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
    subtasks: ["Fondamentaux réseau sur TryHackMe terminés", "10 captures Wireshark analysées dans tes notes", "Savoir expliquer un handshake TCP, une résolution DNS et une connexion TLS"],
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
    subtasks: ["Guide d'hygiène ANSSI lu", "Recommandations ANSSI sur l'AD lues", "Domaine AD monté à la main", "Savoir expliquer Kerberos", "Kerberoasting et sa détection (4769) compris"],
    resources: R("anssi", "mseval"),
  },
  {
    id: "p1-sc900", phase: "p1", months: [3, 6], theme: "Certification", priority: "optionnelle",
    title: "Microsoft SC-900 (facultatif)",
    why: "Faible seule, mais cohérente en environnement Microsoft. QCM facile, environ 76 à 125 €.",
    how: [
      "Suis le parcours gratuit SC-900 sur Microsoft Learn.",
      "Ne la passe que si elle est financée ou si tu as du budget : elle n'est pas indispensable.",
    ],
    subtasks: ["Parcours Microsoft Learn SC-900 suivi", "Examen passé"],
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
    subtasks: ["Script Python publié (parseur de logs)", "Script PowerShell publié (inventaire de postes)", "Script Bash publié"],
    resources: R("github"),
    warn: "Au travail, un script ne tourne qu'avec l'accord de ta hiérarchie.",
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
    subtasks: ["20 labs PortSwigger Apprentice", "15 challenges Web-Serveur sur Root-Me"],
    resources: R("portswigger", "owasp", "rootme", "otw"),
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
    subtasks: ["Savoir expliquer une chaîne de certification", "Hash faible cassé avec Hashcat dans ton lab"],
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
    subtasks: ["Cyber Security 101 terminé", "300 points Root-Me", "Blog ou GitHub avec 5 articles"],
    resources: R("thm", "rootme"),
  },
  {
    id: "p1-check", phase: "p1", months: [6, 6], theme: "Organisation", priority: "critique",
    title: "Point de contrôle : expliquer sans notes",
    why: "Signal d'alerte du document : si au 6e mois tu ne sais pas expliquer un échange DNS ou Kerberos sans notes, ralentis et consolide.",
    how: [
      "Explique à voix haute, ou à quelqu'un, ce qui se passe quand tu tapes une adresse dans ton navigateur (DNS, TCP, HTTP, TLS).",
      "Explique une authentification Kerberos.",
      "Si tu bloques, reprends la notion avant d'avancer dans la phase 2.",
    ],
    subtasks: ["DNS → TCP → HTTP → TLS expliqué sans notes", "Kerberos expliqué sans notes"],
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
    subtasks: ["Wazuh ou Splunk + Sysmon dans le lab", "3 attaques détectées et documentées", "SOC Level 1 entamé"],
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
    subtasks: ["Élévation de privilèges Linux comprise (SUID, sudo)", "Élévation de privilèges Windows comprise (services mal configurés)"],
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
    ],
    subtasks: ["GOAD installé", "Kerberoasting compris et détecté", "AS-REP roasting compris et détecté", "Abus d'ACL compris et détectés"],
    resources: R("goad"),
    warn: "Le lab n'est jamais exposé sur Internet, et ces outils ne vont jamais sur un poste professionnel.",
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
    subtasks: ["Place réservée", "Événement fait"],
    resources: R("lehack", "sstic"),
  },
  {
    id: "p2-cert", phase: "p2", months: [9, 11], theme: "Certification", priority: "critique",
    title: "Première certification pratique : eJPT ou BTL1",
    why: "Les certifications accélèrent, elles ne remplacent pas la pratique. C'est la seule à payer de ta poche en 24 mois.",
    how: [
      "Choisis selon ton penchant : eJPT (INE, 249 $, offensif, examen pratique de 48 h) ou BTL1 (399 £, défensif, 24 h d'investigation).",
      "Alternative : TryHackMe SAL1 ou PT1 (à partir de 349 $).",
      "Astuce budget : attends les soldes du Black Friday (souvent 25 à 50 % chez INE).",
      "Vérifie le prix sur le site officiel avant d'acheter.",
    ],
    subtasks: ["Certification choisie (eJPT ou BTL1)", "Formation achetée", "Formation terminée", "Examen réussi"],
    resources: R("ine", "sbt"),
  },
  {
    id: "p2-bilan", phase: "p2", months: [12, 12], theme: "Organisation", priority: "critique",
    title: "Bilan du 12e mois",
    why: "Le jalon de la première année.",
    how: ["Fais le point sur chaque jalon, et ajuste le rythme de la phase 3 si besoin."],
    subtasks: ["Certification pratique obtenue", "800+ points Root-Me", "Moitié des labs PortSwigger Apprentice", "10 write-ups publiés", "leHACK ou SSTIC fait"],
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
      "GRC si tu préfères le pilotage. Elle est très demandée dans la banque à cause de DORA.",
      "Compare les filières dans l'onglet « Guide de référence ».",
    ],
    subtasks: ["Filière choisie"],
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
    subtasks: ["Liste de masters SecNumedu établie", "Candidatures envoyées", "Admission obtenue", "Alternance en équipe sécurité trouvée"],
    resources: R("anssi"),
  },
  {
    id: "p3-approf", phase: "p3", months: [13, 18], theme: "Offensif", priority: "haute",
    title: "Approfondir ta filière",
    why: "Construire une vraie profondeur dans la spécialité choisie. Ne coche que les jalons de ta filière.",
    how: [
      "Offensif : 20 machines HTB, l'Academy AD, puis le PNPT ou le CPTS.",
      "Défensif : CyberDefenders, forensic Windows et mémoire.",
      "GRC : EBIOS RM, ISO 27001, DORA.",
    ],
    subtasks: ["Offensif : 20 machines HTB", "Offensif : Academy AD", "Défensif : investigations CyberDefenders", "Défensif : forensic Windows et mémoire", "GRC : EBIOS RM, ISO 27001 et DORA"],
    resources: R("htb", "htbAcademy", "cyberdefenders"),
  },
  {
    id: "p3-cloud", phase: "p3", months: [13, 18], theme: "Cloud", priority: "normale",
    title: "Cloud : identités hybrides AD ↔ Entra ID",
    why: "Les SI migrent vers Entra ID et le cloud hybride.",
    how: [
      "Comprends la synchronisation des identités entre AD et Entra ID.",
      "Étudie les erreurs IAM classiques (Azure, AWS).",
      "Plus tard, en filière cloud : la SC-500 (165 $), qui remplace l'AZ-500 retirée le 31 août 2026.",
    ],
    subtasks: ["Identités hybrides AD ↔ Entra ID comprises", "Erreurs IAM classiques étudiées"],
    resources: R("mslearn"),
  },
  {
    id: "p3-cert2", phase: "p3", months: [15, 20], theme: "Certification", priority: "haute",
    title: "Deuxième certification pratique",
    why: "Objectif à 24 mois : 2 certifications pratiques. Fais-la financer, idéalement par ton employeur ou ton alternance.",
    how: [
      "Offensif : PNPT (499 $ ; 5 jours de pentest, 2 jours de rapport et un débrief oral) ou HTB CPTS (10 jours, très exigeant).",
      "GRC : ISO 27001 LI/LA ou EBIOS RM, financées.",
      "Défensif : prouve ta pratique (homelab SIEM documenté, investigations).",
    ],
    subtasks: ["Certification choisie", "Financement obtenu", "Examen réussi"],
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
    subtasks: ["FCSC 2027 : participation", "404CTF 2027 en équipe", "FCSC : top 25 % junior"],
    resources: R("fcsc", "ctf404", "hackropole", "ctftime"),
  },
  {
    id: "p3-bugbounty", phase: "p3", months: [14, 24], theme: "Offensif", priority: "optionnelle",
    title: "Bug bounty (si offensif)",
    why: "Ce n'est pas une source de revenus pour un débutant. Commence après 9 à 12 mois de pratique du web.",
    how: [
      "Entraîne-toi sur le Dojo de YesWeHack.",
      "Lis entièrement le périmètre du programme avant de tester quoi que ce soit.",
      "Rédige des rapports clairs et reproductibles.",
    ],
    subtasks: ["Dojo YesWeHack commencé", "Premier rapport envoyé"],
    resources: R("ywh"),
    warn: "Ne teste que le périmètre autorisé par le programme.",
  },
  {
    id: "p3-visibilite", phase: "p3", months: [18, 24], theme: "Communauté", priority: "normale",
    title: "Visibilité : talk et open source",
    why: "Le junior qui a des preuves s'en sort très bien sur un marché « en sablier ».",
    how: [
      "Propose un talk en meetup (OWASP France, communautés locales).",
      "Contribue à l'open source : règles Sigma, outils.",
    ],
    subtasks: ["Un talk en meetup", "Une contribution open source (règles Sigma, outil)"],
    resources: [],
  },
  {
    id: "p3-bilan", phase: "p3", months: [24, 24], theme: "Organisation", priority: "critique",
    title: "Bilan des 24 mois",
    why: "La fin de la feuille de route.",
    how: ["Fais le point, mets à jour ton CV et ton portfolio, et prépare la suite."],
    subtasks: ["2 certifications pratiques", "Portfolio de 20+ contenus", "Alternance de master en équipe sécurité", "OSCP envisagée, sur financement employeur"],
    resources: R("offsec"),
  },

  // ───────────── Alternance ─────────────
  {
    id: "alt-traduire", phase: "alt", months: [1, 3], theme: "Alternance", priority: "haute",
    title: "Traduire ton poste en compétences cyber",
    why: "Ton poste t'apprend déjà des compétences cyber. Il faut savoir les nommer et les valoriser.",
    how: [
      "Comptes et groupes AD → gestion des identités et moindre privilège : comprends pourquoi tel groupe donne tel droit.",
      "Déploiement des postes → durcissement, correctifs, EDR : apprends les GPO de sécurité, BitLocker et LAPS.",
      "Tickets → premier niveau de réponse à incident : identifie et escalade les tickets suspects (phishing, poste anormal).",
      "Relais métiers/DSI → sensibilisation ; gestion de parc → cartographie du SI, un pilier de DORA.",
    ],
    subtasks: [
      "Signaler (sans modifier) les comptes inactifs et les droits excessifs",
      "GPO de sécurité, BitLocker et LAPS compris",
      "Accès en lecture à la console EDR demandé",
      "Escalader correctement un ticket suspect (phishing, poste anormal)",
      "Relayer une campagne de sensibilisation",
    ],
    resources: [],
    warn: "Tu signales, tu ne modifies pas. Toute action sort de ton périmètre sans accord écrit.",
  },
  {
    id: "alt-reglementaire", phase: "alt", months: [3, 6], theme: "Alternance", priority: "normale",
    title: "Comprendre le contexte réglementaire bancaire",
    why: "La régulation crée la demande, et c'est le quotidien des équipes sécurité de ta banque.",
    how: [
      "DORA : gestion du risque informatique, déclaration des incidents, tests de résilience, prestataires TIC.",
      "TIBER-FR : tests red team fondés sur le renseignement sur la menace, exigés par DORA.",
      "NIS2 et le Référentiel Cyber France (ReCyF) de l'ANSSI.",
      "Supervision (BCE, ACPR) et PCI-DSS en culture générale.",
    ],
    subtasks: ["DORA : grandes obligations et délais de notification", "TIBER-FR compris", "NIS2 et ReCyF : état des lieux"],
    resources: R("acpr", "anssi"),
  },
  {
    id: "alt-missions", phase: "alt", months: [4, 12], theme: "Alternance", priority: "haute",
    title: "Obtenir des missions sécurité auprès de ton tuteur",
    why: "Une mission avec l'équipe sécurité est la preuve la plus forte pour la suite (jalon des mois 10 à 12).",
    how: [
      "Participer au traitement des signalements de phishing ou aux campagnes de sensibilisation.",
      "Observer l'équipe SOC/CERT ou sécurité opérationnelle pendant une demi-journée.",
      "Contribuer à un projet de durcissement : déploiement EDR, recommandations ANSSI sur l'AD, migration Entra ID.",
      "Documenter les procédures de gestion de postes avec un angle sécurité.",
      "Écrire des scripts d'automatisation (inventaire, conformité) validés par ta hiérarchie.",
    ],
    subtasks: [
      "Signalements phishing ou campagne de sensibilisation",
      "Demi-journée d'observation SOC/CERT",
      "Contribution à un projet de durcissement",
      "Procédures de gestion de postes documentées (angle sécurité)",
      "Script d'automatisation validé par ta hiérarchie",
      "Au moins une mission réalisée avec l'équipe sécurité",
    ],
    resources: [],
    warn: "Ces missions supposent l'accord de ta hiérarchie et dépendent de l'organisation interne.",
  },
  {
    id: "alt-rssi", phase: "alt", months: [4, 12], theme: "Alternance", priority: "haute",
    title: "Te rapprocher du RSSI et des équipes sécurité",
    why: "Un contact régulier avec le RSSI ou le SOC est un jalon des mois 10 à 12, et la porte d'entrée vers un master en alternance.",
    how: [
      "Demande une présentation à ton tuteur, et arrive avec une question précise.",
      "Montre des preuves : une escalade bien documentée, ton lab AD, ton classement Root-Me.",
      "Intéresse-toi à leurs sujets (DORA, tests de résilience).",
    ],
    subtasks: ["Présentation au RSSI ou à l'équipe sécurité", "Contact régulier avec le RSSI ou le SOC"],
    resources: [],
  },

  // ───────────── Habitudes ─────────────
  {
    id: "hab-veille", phase: "hab", months: null, theme: "Veille", priority: "haute",
    title: "Veille : 20 minutes par jour",
    why: "Rester à jour, et avoir des sujets à discuter avec les équipes sécurité.",
    how: [
      "CERT-FR, actualités de l'ANSSI, flux de CVE.",
      "Newsletters tl;dr sec et SANS NewsBites, podcast NoLimitSecu.",
      "Lis le Panorama de la cybermenace annuel de l'ANSSI.",
    ],
    subtasks: ["Sources de veille abonnées", "Routine de 20 min installée"],
    resources: R("certfr", "tldrsec", "sans", "nolimitsecu"),
  },
  {
    id: "hab-notes", phase: "hab", months: null, theme: "Organisation", priority: "haute",
    title: "Règle d'or : 30 % théorie, 70 % pratique, une note par notion",
    why: "Écrire avec tes propres mots, c'est la preuve que tu as compris, et la matière de ton portfolio.",
    how: [
      "À la fin de chaque notion, écris une note avec tes propres mots.",
      "Range tes notes dans « Mes travaux », ou dans ton dépôt GitHub.",
    ],
    subtasks: [],
    resources: [],
  },
  {
    id: "hab-rootme", phase: "hab", months: null, theme: "Offensif", priority: "normale",
    title: "Root-Me : une soirée par semaine",
    why: "600+ challenges en français. Ton classement est une preuve visible de ta progression.",
    how: ["Commence par les challenges à 5 et 10 points, puis monte en difficulté."],
    subtasks: ["300 points (mois 6)", "800 points (mois 12)"],
    resources: R("rootme"),
  },
  {
    id: "hab-livres", phase: "hab", months: null, theme: "Veille", priority: "normale",
    title: "Un livre par trimestre",
    why: "Les livres de référence donnent la profondeur que les labs n'ont pas.",
    how: ["Un livre par trimestre, en notant les idées clés."],
    subtasks: ["Réseaux (Tanenbaum)", "The Linux Command Line (Shotts, gratuit)", "Practical Malware Analysis", "Blue Team Handbook"],
    resources: R("tlcl"),
  },
  {
    id: "hab-communaute", phase: "hab", months: null, theme: "Communauté", priority: "normale",
    title: "Rejoindre ou créer une équipe CTF",
    why: "Les compétitions et la communauté font progresser plus vite que le travail seul.",
    how: [
      "Rejoins le Discord de Root-Me, ceux des CTF et des associations étudiantes.",
      "Va aux meetups OWASP France.",
      "Monte une équipe pour le 404CTF.",
    ],
    subtasks: ["Discord Root-Me rejoint", "Équipe CTF trouvée ou créée", "Premier meetup"],
    resources: R("rootme", "ctftime"),
  },
  {
    id: "hab-portfolio", phase: "hab", months: null, theme: "Carrière", priority: "normale",
    title: "Portfolio et LinkedIn : un post par mois",
    why: "Selon l'ANSSI, 69 % des pros de la cyber ont été approchés par des recruteurs dans l'année.",
    how: [
      "Blog ou GitHub : write-ups de challenges retirés ou autorisés, documentation de ton homelab, tes scripts.",
      "LinkedIn : un post par mois sur un apprentissage (lab, CTF, certification).",
    ],
    subtasks: ["Blog ou GitHub créé", "Profil LinkedIn à jour"],
    resources: R("github"),
    warn: "Root-Me interdit de publier les solutions des challenges actifs. HTB n'autorise que les machines retirées.",
  },
];

/* Ordre des fondamentaux (section 1 du document), relié aux actions du tracker. */
const FUNDAMENTALS = [
  { n: 1, name: "Réseau TCP/IP", detail: "OSI, IP, routage, TCP/UDP, DNS, DHCP, HTTP/TLS, VLAN, NAT, pare-feu", why: "Toute attaque et toute détection passent par le réseau", goal: "Lire une capture Wireshark et expliquer un handshake TCP, une résolution DNS, une connexion TLS", action: "p1-reseau" },
  { n: 2, name: "Linux", detail: "shell, droits, processus, services, journaux, SSH, cron", why: "Serveurs, outils de sécurité et machines de CTF tournent sous Linux", goal: "Administrer une VM Debian sans interface ; finir OverTheWire Bandit", action: "p1-linux" },
  { n: 3, name: "Windows et Active Directory", detail: "GPO, Kerberos/NTLM, ACL, LAPS, journaux, PowerShell", why: "Cœur des SI d'entreprise et cible n°1 des rançongiciels. Ton avantage grâce à ton poste", goal: "Monter un domaine chez toi, expliquer Kerberos, comprendre le Kerberoasting et sa détection (4769)", action: "p1-ad" },
  { n: 4, name: "Scripting", detail: "Python, Bash, PowerShell", why: "Automatiser, parser des logs, écrire des outils", goal: "Un parseur de logs en Python, un inventaire de postes en PowerShell", action: "p1-script" },
  { n: 5, name: "Systèmes", detail: "mémoire, processus, virtualisation, assembleur plus tard", why: "Élévation de privilèges, forensic, malware", goal: "Comprendre une élévation de privilèges Linux (SUID, sudo) et Windows (services mal configurés)", action: "p2-systemes" },
  { n: 6, name: "Web", detail: "HTTP, sessions, OWASP Top 10 : injections SQL, XSS, contrôle d'accès, SSRF", why: "Première surface d'attaque exposée, base de l'AppSec et du bug bounty", goal: "Labs « Apprentice » de PortSwigger sur les principales vulnérabilités", action: "p1-web" },
  { n: 7, name: "Cryptographie appliquée", detail: "hash, symétrique/asymétrique, PKI, TLS", why: "Mots de passe, certificats, signatures : partout", goal: "Expliquer une chaîne de certification ; casser un hash faible avec Hashcat dans ton lab", action: "p1-crypto" },
  { n: 8, name: "Bases défensives", detail: "SIEM, EDR, logs, MITRE ATT&CK, incidents", why: "Les postes juniors les plus nombreux sont en SOC", goal: "Wazuh ou Splunk Free dans ton lab, détecter une attaque que tu as lancée", action: "p2-siem" },
  { n: 9, name: "Cloud", detail: "Azure/Entra ID, AWS IAM", why: "Les SI migrent vers Entra ID et le cloud hybride", goal: "Comprendre les identités hybrides AD ↔ Entra ID et les erreurs IAM classiques", action: "p3-cloud" },
];

const WEEK = [
  { when: "2 soirées", dur: "1 h 30 chacune", what: "Théorie + labs guidés" },
  { when: "1 soirée", dur: "1 h", what: "Root-Me ou veille" },
  { when: "Samedi matin", dur: "3 à 4 h", what: "Homelab ou CTF" },
  { when: "Chaque jour", dur: "20 min", what: "Veille, dans les transports" },
];

const RULES = [
  "Ne lance jamais Nmap, un audit AD ou un outil de pentest sur le réseau de ton employeur sans mandat écrit de la sécurité. Un scan déclenche aussi une alerte SOC à ton nom.",
  "N'installe aucun outil offensif (Kali, Mimikatz…) sur un poste professionnel.",
  "Ne consulte pas de données hors de ton besoin d'en connaître, même si tes droits le permettent.",
  "Si tu découvres une faille, signale-la sans l'exploiter « pour vérifier ».",
  "Respecte la charte informatique et le secret professionnel bancaire.",
];

const WORK_CATEGORIES = [
  "Notes de cours", "Write-up", "Script / outil", "Documentation de lab",
  "Rapport / document", "Certification", "Veille", "Autre",
];
