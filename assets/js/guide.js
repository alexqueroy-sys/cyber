"use strict";
/* Guide de référence : le contenu complet du document, en lecture.
   Contenu statique écrit à la main, inséré tel quel en HTML. */

const G = {
  table: (head, rows) =>
    `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`,
  list: (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`,
  a: (key, label) => `<a href="${L[key][1]}" target="_blank" rel="noopener noreferrer">${label || L[key][0]}</a>`,
  note: (text, tone = "info") => `<div class="callout callout-${tone}">${text}</div>`,
};

const GUIDE = [
  {
    id: "resume",
    title: "En résumé",
    html: `
      <p>Pour devenir très fort en cyber, pose d'abord les fondamentaux (réseau, Linux, Windows/Active Directory, scripting), pratique chaque semaine sur des plateformes légales, et utilise ton alternance chez ${EMPLOYEUR} comme un laboratoire défensif encadré. Vise une première certification pratique (eJPT ou BTL1) d'ici 12 mois, puis un master en alternance labellisé SecNumedu. L'OSCP viendra plus tard.</p>
      ${G.list([
        "<strong>Les bases avant les outils</strong> : réseau → Linux → Windows/AD → scripting → web → crypto. Avec 8 à 10 h par semaine, 6 mois suffisent pour les poser.",
        "<strong>Les certifications accélèrent, elles ne remplacent pas la pratique.</strong> Parcours : SC-900 ou Security+ (facultatif) → eJPT (249 $) ou BTL1 (399 £) → PNPT ou HTB CPTS → OSCP (1 749 $), idéalement financée par un employeur.",
        "<strong>Ton alternance est ton meilleur atout</strong>, mais ne teste jamais rien sur le SI de ton employeur sans autorisation écrite (article 323-1 du Code pénal : 3 ans et 100 000 €).",
      ])}
      ${G.note("<strong>Hypothèses retenues</strong> : bases générales en informatique mais peu de pratique sécurité ; budget étudiant ; 6 à 10 h libres par semaine ; poste de correspondant informatique (support de proximité, relais métiers/DSI, gestion de parc). Plus de temps : compresse le planning. Moins : étire-le, sans sauter d'étape.")}
    `,
  },
  {
    id: "fondamentaux",
    title: "1. Les fondamentaux, dans l'ordre",
    html: `
      <p>Chaque brique sert la suivante. Les débutants qui plafonnent ont souvent sauté le réseau ou l'AD pour aller directement aux outils d'attaque. L'ordre n'est pas une file stricte : Linux et réseau avancent en parallèle, et tu pratiques déjà Windows/AD au travail.</p>
      ${G.table(
        ["#", "Notion", "Pourquoi c'est vital", "Objectif concret"],
        FUNDAMENTALS.map((f) => [f.n, `<strong>${f.name}</strong><br><span class="muted">${f.detail}</span>`, f.why, f.goal])
      )}
      ${G.note("<strong>Règle d'or</strong> : 30 % de théorie, 70 % de pratique, et une note écrite avec tes propres mots à la fin de chaque notion. Tu as une base solide quand tu sais expliquer sans notes ce qui se passe quand tu tapes une adresse dans ton navigateur (DNS, TCP, HTTP, TLS).")}
    `,
  },
  {
    id: "ressources",
    title: "2. Ressources pour approfondir",
    html: `
      <p>Presque tout est gratuit : le seul abonnement à payer la première année est TryHackMe (environ 100 $ par an en tarif étudiant).</p>
      <h3>Plateformes pratiques</h3>
      ${G.table(
        ["Ressource", "Coût", "Langue", "Pour quoi", "Quand"],
        [
          [G.a("thm"), "Gratuit en partie, ~100-107 $/an étudiant", "EN", "Parcours guidés : Pre-Security, Cyber Security 101, SOC Level 1, Jr Penetration Tester", "Dès maintenant"],
          [G.a("rootme"), "Gratuit", "FR", "600+ challenges en 11 catégories", "Dès maintenant (challenges à 5 et 10 points)"],
          [G.a("hackropole"), "Gratuit", "FR", "620+ challenges des archives du FCSC", "Préparation au FCSC"],
          [G.a("portswigger"), "Gratuit", "EN", "La référence en sécurité web", "À partir du 4e mois"],
          [G.a("otw"), "Gratuit", "EN", "Linux en ligne de commande, web", "Premier mois"],
          [`${G.a("htb", "Hack The Box")} (Labs, ${G.a("htbAcademy", "Academy")})`, "Labs VIP+ 25 $/mois ; Academy étudiant 10 $/mois", "EN", "Machines non guidées, cours AD excellents", "À partir du 9e mois"],
          [`${G.a("btlo")}, ${G.a("cyberdefenders")}, ${G.a("letsdefend")}`, "Gratuit en partie", "EN", "Investigations SOC/DFIR", "Filière défensive"],
        ]
      )}
      <h3>Cours et lectures (en français d'abord)</h3>
      ${G.list([
        "<strong>SecNumacadémie (ANSSI)</strong> : l'ancienne plateforme a fermé le 28 février 2026 ; une version refondue est annoncée courant 2026 via MesServicesCyber. Culture SSI utile pour ton poste, pas très technique.",
        `<strong>${G.a("anssi")}</strong> : Guide d'hygiène informatique (42 mesures), Recommandations de sécurité relatives à Active Directory, Recommandations pour la journalisation des systèmes Windows.`,
        `<strong>${G.a("netacad")}</strong> et <strong>${G.a("mslearn")}</strong> (SC-900, Entra ID) : cours gratuits.`,
        "<strong>Vidéos</strong> : IppSec, John Hammond, TCM Security (EN) ; archives de SSTIC et leHACK (FR) ; podcast NoLimitSecu (FR).",
        "<strong>Livres (un par trimestre)</strong> : Réseaux (Tanenbaum), The Linux Command Line (Shotts, gratuit), Practical Malware Analysis, Blue Team Handbook, et le Panorama de la cybermenace annuel de l'ANSSI.",
      ])}
      <h3>Homelab (0 € avec 16 Go de RAM)</h3>
      ${G.list([
        "<strong>Hyperviseur</strong> : VirtualBox ou VMware Workstation (gratuits), Proxmox sur un vieux PC.",
        "<strong>Mois 1-3</strong> : une VM Kali Linux et une VM Debian serveur.",
        "<strong>Mois 4-6</strong> : un domaine AD monté à la main (Windows Server en évaluation 180 jours + un client Windows).",
        `<strong>Mois 7-12</strong> : ${G.a("goad")}, un lab AD vulnérable. MINILAB ou GOAD-Mini avec ~16 Go de RAM, GOAD-Light avec ~32 Go. Jamais exposé sur Internet.`,
        "<strong>Côté défense</strong> : Wazuh ou Splunk Free + Sysmon. Attaque ton lab, vérifie ce que tu détectes, corrige. Cette boucle purple team fait les profils d'exception.",
      ])}
    `,
  },
  {
    id: "filieres",
    title: "3. Les grandes filières",
    html: `
      ${G.note("<strong>Recommandation</strong> : un socle défensif + Active Directory pendant 12 mois, avec l'offensif en loisir (CTF, labs), puis un choix de spécialité vers 12-18 mois.")}
      ${G.table(
        ["Filière", "Ce que tu fais", "Entrée typique", "Adéquation avec ton profil"],
        [
          ["<strong>Offensif / pentest / red team</strong>", "Tester des SI, applis et AD avec autorisation ; rédiger des rapports", "Pentester junior en cabinet d'audit (souvent qualifié PASSI)", "Bonne si tu aimes casser et rédiger ; marché junior plus disputé"],
          ["<strong>Défensif / SOC / blue team</strong>", "Surveiller, trier les alertes SIEM/EDR, investiguer", "Analyste SOC N1/N2, beaucoup de postes juniors", "Très forte : ton expérience postes et AD est valorisable"],
          ["<strong>Réponse à incident / forensic</strong> (CERT, CSIRT)", "Gérer une crise, analyser disques, mémoire, journaux", "Souvent après 2-3 ans de SOC", "Forte à moyen terme"],
          ["<strong>GRC / conformité / risques</strong>", "Politiques, EBIOS RM, audits ISO 27001, conformité DORA/NIS2", "Consultant GRC junior, assistant RSSI", "Très forte dans la banque : DORA crée une forte demande"],
          ["<strong>Sécurité cloud</strong>", "Sécuriser Azure/AWS/GCP, IAM, configuration", "Rarement en premier poste", "Bonne, via la migration Entra ID"],
          ["<strong>AppSec / DevSecOps</strong>", "Revue de code, tests SAST/DAST, sécurité du cycle de dev", "Développeur puis AppSec", "Moyenne, sauf si tu aimes coder"],
        ]
      )}
      <p>Choisis pentest/red team si tu prends plus de plaisir à attaquer, SOC/DFIR si c'est l'investigation qui te passionne, GRC si tu préfères le pilotage.</p>
    `,
  },
  {
    id: "certifications",
    title: "4. Parcours de certifications",
    html: `
      <p>Paie de ta poche une seule certification pratique en 24 mois (eJPT ou BTL1) et fais financer le reste. Prix catalogue relevés en 2026 : vérifie sur le site officiel avant d'acheter.</p>
      ${G.table(
        ["Certification", "Prix", "Format et difficulté", "Reconnaissance en France", "Quand"],
        [
          ["Microsoft SC-900", "~76 à 125 €", "QCM, facile", "Faible seule, cohérente en environnement Microsoft", "Mois 3-6, facultatif"],
          ["CompTIA Security+ (SY0-701)", "439 $ depuis juin 2026", "QCM + questions pratiques", "Moyenne en France", "Facultatif, si financée"],
          ["CCNA (Cisco)", "~300 $", "QCM + simulations", "Bonne pour réseau/infra", "Facultatif"],
          [`<strong>${G.a("ine", "eJPT (INE)")}</strong>`, "249 $, 3 mois de formation + repassage inclus", "Pratique, 48 h", "Bonne première certif offensive", "<strong>Mois 9-12 (offensif)</strong>"],
          [`<strong>${G.a("sbt", "BTL1 (Security Blue Team)")}</strong>`, "399 £, formation incluse, à vie", "Pratique, 24 h d'investigation", "Bonne auprès des managers SOC", "<strong>Mois 9-12 (défensif)</strong>"],
          ["TryHackMe SAL1 / PT1", "À partir de 349 $", "Simulations SOC / pentest", "Récente, encore limitée", "Alternative à BTL1 / eJPT"],
          [G.a("tcm", "PNPT (TCM Security)"), "499 $", "5 jours de pentest + 2 jours de rapport + débrief oral", "Bonne et en hausse", "Mois 15-20"],
          ["HTB CPTS", "Inclus dans Academy Silver annuel (550 $)", "10 jours, très exigeant", "Excellente chez les pentesters", "Alternative au PNPT"],
          [G.a("offsec", "OSCP / OSCP+ (OffSec)"), "1 749 $ (repassage 249 $)", "24 h de pentest + 24 h de rapport, difficile", "La plus connue des recruteurs offensifs", "24 mois ou plus, financée par l'employeur"],
          ["Microsoft SC-500", "165 $", "QCM + cas pratiques", "Bonne en sécurité cloud Microsoft", "Plus tard, filière cloud"],
          ["ISO 27001 LI/LA, EBIOS RM", "Plusieurs centaines à milliers d'euros", "Examen écrit", "Très valorisées en GRC", "Si filière GRC, financées"],
        ]
      )}
      ${G.list([
        "L'AZ-500 n'existe plus : retirée le 31 août 2026, remplacée par la SC-500.",
        "<strong>Ce que valorisent les recruteurs</strong> : en offensif, l'OSCP puis PNPT et CPTS ; en SOC, la preuve pratique (BTL1, homelab SIEM documenté) ; en GRC, ISO 27001, EBIOS RM, DORA/NIS2 et un bac+5.",
        "<strong>Astuce budget</strong> : attends les soldes du Black Friday (jusqu'à 40 % chez TryHackMe en 2025, souvent 25-50 % chez INE).",
      ])}
    `,
  },
  {
    id: "alternance",
    title: "5. Tirer parti de ton alternance",
    html: `
      <p>Ton poste chez ${EMPLOYEUR} t'apprend déjà des compétences cyber : il faut savoir les traduire et te rapprocher des équipes sécurité.</p>
      ${G.table(
        ["Ce que tu fais", "Équivalent cyber", "Comment le valoriser"],
        [
          ["Comptes et groupes AD, réinitialisations", "Gestion des identités et des accès, moindre privilège", "Comprendre pourquoi tel groupe donne tel droit ; signaler (sans modifier) comptes inactifs et droits excessifs"],
          ["Déploiement et maintien des postes", "Durcissement, correctifs, EDR", "Apprendre les GPO de sécurité, BitLocker, LAPS ; demander un accès en lecture à la console EDR"],
          ["Tickets et incidents", "Premier niveau de réponse à incident", "Identifier et escalader correctement les tickets suspects (phishing, poste anormal)"],
          ["Relais métiers / DSI", "Communication de risque, sensibilisation", "Relayer les campagnes de sensibilisation, animer un court atelier phishing"],
          ["Gestion de parc", "Cartographie du SI, pilier de DORA", "Fiabiliser et automatiser l'inventaire en PowerShell, avec l'accord de ta hiérarchie"],
        ]
      )}
      <h3>Missions à demander à ton tuteur</h3>
      ${G.list([
        "Participer au traitement des signalements de phishing ou aux campagnes de sensibilisation.",
        "Observer l'équipe SOC/CERT ou sécurité opérationnelle une demi-journée.",
        `Contribuer à un projet de durcissement : déploiement EDR, recommandations ANSSI sur l'AD, migration Entra ID. Regarde si ${EMPLOYEUR} publie des offres d'alternance sur ces sujets : c'est le signe que ces équipes existent.`,
        "Documenter les procédures de gestion de postes avec un angle sécurité.",
        "Écrire des scripts d'automatisation (inventaire, conformité) validés par ta hiérarchie.",
      ])}
      <h3>Te rapprocher du RSSI et des équipes sécurité</h3>
      ${G.list([
        "Demande à ton tuteur une présentation, et arrive avec une question précise, pas un « je veux faire de la cyber ».",
        "Montre des preuves : une escalade bien documentée, ton lab AD, ton classement Root-Me.",
        "Intéresse-toi à leurs sujets (DORA, tests de résilience).",
        `Pense à la suite : un master cyber en alternance dans une équipe sécurité de ${EMPLOYEUR}, de l'ACPR ou d'une autre banque.`,
      ])}
      <h3>Le contexte réglementaire bancaire</h3>
      ${G.list([
        "<strong>DORA</strong> (règlement UE 2022/2554), applicable depuis le 17 janvier 2025 : gestion du risque informatique, déclaration des incidents, tests de résilience, risque lié aux prestataires TIC. Incident majeur : notification initiale dans les 4 h après classification (24 h max après détection), rapport intermédiaire sous 72 h, rapport final sous un mois.",
        "<strong>TIBER-FR</strong> : tests red team fondés sur le renseignement sur la menace (TLPT), exigés par DORA. Le sommet de la filière offensive dans la finance.",
        "<strong>NIS2</strong> : pas encore transposée en France en octobre 2026 (projet de loi « Résilience »). L'ANSSI a publié le Référentiel Cyber France (ReCyF) le 17 mars 2026.",
        `<strong>Supervision</strong> : la BCE supervise les banques importantes, l'${G.a("acpr")} les autres et reçoit les déclarations DORA.`,
        "<strong>PCI-DSS</strong> : norme des cartes de paiement, bonne culture générale, moins centrale pour ton poste.",
      ])}
      <h3>Éthique et légalité au travail : non négociable</h3>
      ${G.note(G.list(RULES), "danger")}
    `,
  },
  {
    id: "communaute",
    title: "6. CTF, communautés, bug bounty, portfolio",
    html: `
      <p>Les compétitions et la communauté font progresser plus vite que le travail seul : rejoins ou crée une équipe.</p>
      <h3>CTF en France</h3>
      ${G.list([
        `<strong>${G.a("fcsc")}</strong> : CTF individuel avec un classement 14-25 ans (tu es éligible). L'édition 2026 a réuni plus de 2 000 participants et sélectionne la Team France pour l'ECSC. Objectif : FCSC 2027 (printemps, date à confirmer).`,
        `<strong>${G.a("ctf404")}</strong> (DGSE et Télécom SudParis) : la plus grande compétition française, très adaptée aux débutants. 5e édition du 16 mai au 7 juin 2026.`,
        `<strong>Autres</strong> : CTF d'écoles, wargame de leHACK, Challenge DGSE x Root-Me PRO, puis les CTF internationaux sur ${G.a("ctftime", "CTFtime.org")}.`,
      ])}
      <h3>Événements</h3>
      ${G.list([
        `<strong>${G.a("lehack")}</strong> (fin juin, Cité des sciences, Paris) : le premier événement à faire.`,
        `<strong>${G.a("sstic")}</strong> (début juin, Rennes) : la conférence technique de référence, vidéos gratuites en ligne.`,
        "Hexacon (Paris, octobre), Hack in Paris, BotConf, THCon (Toulouse), Forum InCyber (Lille, pour le recrutement).",
        "<strong>Communautés</strong> : Discord de Root-Me, des CTF, des associations étudiantes ; meetups OWASP France.",
      ])}
      <h3>Bug bounty</h3>
      ${G.list([
        `${G.a("ywh")} (plateforme française) et son espace d'entraînement Dojo ; aussi Intigriti, HackerOne, Bugcrowd.`,
        "Pas une source de revenus pour un débutant : commence après 9-12 mois de web. Ne teste que le périmètre autorisé par le programme.",
      ])}
      <h3>Portfolio et veille</h3>
      ${G.list([
        "<strong>Blog ou GitHub</strong> : write-ups de challenges retirés ou autorisés (Root-Me interdit les solutions des challenges actifs, HTB n'autorise que les machines retirées), documentation de ton homelab, tes scripts.",
        `<strong>Veille (20 min par jour)</strong> : ${G.a("certfr")}, actualités de l'ANSSI, flux de CVE, newsletters ${G.a("tldrsec")} et ${G.a("sans")}, podcast ${G.a("nolimitsecu", "NoLimitSecu")}.`,
        "<strong>LinkedIn</strong> : un post par mois sur un apprentissage (lab, CTF, certification). Selon l'ANSSI, 69 % des pros de la cyber ont été approchés par des recruteurs dans l'année.",
      ])}
    `,
  },
  {
    id: "planning",
    title: "7. Planning sur 24 mois",
    html: `
      <p><strong>Semaine type (8-10 h)</strong> : 2 soirées de 1 h 30 (théorie + labs guidés), 1 soirée d'1 h (Root-Me ou veille), samedi matin 3-4 h (homelab ou CTF), 20 minutes de veille par jour dans les transports.</p>
      <h3>Phase 1 : mois 0 à 6, les fondations</h3>
      ${G.table(["Mois", "Focus", "Jalons mesurables"], [
        ["1", "Linux", "OverTheWire Bandit niveaux 0-20 ; TryHackMe Pre-Security terminé"],
        ["2", "Réseau", "Fondamentaux réseau sur TryHackMe ; 10 captures Wireshark analysées dans tes notes"],
        ["3", "Windows/AD", "Guides ANSSI Hygiène et AD lus ; domaine AD monté à la main ; SC-900 (facultatif)"],
        ["4", "Scripting", "3 scripts utiles publiés sur GitHub (Python, PowerShell, Bash)"],
        ["5", "Web", "20 labs PortSwigger Apprentice ; 15 challenges Web-Serveur sur Root-Me"],
        ["6", "Synthèse", "Cyber Security 101 terminé ; 300 points Root-Me ; blog ou GitHub avec 5 articles"],
      ])}
      <h3>Phase 2 : mois 6 à 12, première spécialisation et première certification</h3>
      ${G.table(["Mois", "Focus", "Jalons mesurables"], [
        ["7-8", "Défense : SIEM, journaux Windows, ATT&amp;CK", "Wazuh ou Splunk + Sysmon dans le lab ; 3 attaques détectées et documentées ; SOC Level 1 entamé"],
        ["8-9", "Attaque AD", "GOAD installé ; Kerberoasting, AS-REP roasting et abus d'ACL compris et détectés"],
        ["9-11", "Certification", "eJPT ou BTL1 selon ton penchant"],
        ["10-12", "Au travail", "Au moins une mission avec l'équipe sécurité ; un contact régulier au RSSI ou au SOC"],
        ["12", "Bilan", "Certification pratique obtenue ; 800+ points Root-Me ; moitié des labs PortSwigger Apprentice ; 10 write-ups ; leHACK ou SSTIC fait"],
      ])}
      <h3>Phase 3 : mois 12 à 24, spécialisation et crédibilité</h3>
      ${G.table(["Mois", "Focus", "Jalons mesurables"], [
        ["12-14", "Choix de filière", "Admission dans un master cyber en alternance, de préférence SecNumedu"],
        ["13-18", "Approfondissement", "Offensif : 20 machines HTB, Academy AD, puis PNPT ou CPTS. Défensif : CyberDefenders, forensic Windows et mémoire. GRC : EBIOS RM, ISO 27001, DORA"],
        ["16-17", "Compétitions", "FCSC 2027 dans le top 25 % junior ; 404CTF 2027 en équipe"],
        ["18-24", "Visibilité", "Un talk en meetup ; contributions open source (règles Sigma, outils) ; premiers rapports YesWeHack si offensif"],
        ["24", "Bilan", "2 certifications pratiques ; portfolio de 20+ contenus ; alternance de master en équipe sécurité ; OSCP envisagée sur financement employeur"],
      ])}
      ${G.note("<strong>Signal d'alerte</strong> : si au 6e mois tu ne sais pas expliquer un échange DNS ou Kerberos sans notes, ralentis et consolide.", "warning")}
    `,
  },
  {
    id: "etudes",
    title: "8. Poursuite d'études et marché de l'emploi",
    html: `
      <p>L'étape la plus rentable après le bachelor est un master cyber en alternance : il valide le bac+5 et te donne une expérience cyber réelle, financée par l'entreprise.</p>
      <h3>Après le bachelor</h3>
      ${G.list([
        "<strong>Label SecNumedu (ANSSI)</strong> : plus de 60 formations de bac+3 à bac+6, publiques et privées. Vérifie la date d'expiration du label, plusieurs arrivent à échéance en 2026.",
        "<strong>Critères de choix</strong> : label, rythme compatible avec un poste en équipe sécurité, taux d'insertion, présence de CTF et d'une asso cyber, coût (les masters universitaires sont bien moins chers que les mastères privés).",
      ])}
      <h3>Le marché en France</h3>
      ${G.list([
        "<strong>Les faits solides</strong> (ANSSI, Observatoire des métiers 2025) : plus de 23 000 offres cyber analysées, en hausse de 49 % entre 2019 et 2024 ; 40 % requièrent un bac+5 ; seulement 33 % des pros ont un diplôme spécifiquement cyber.",
        "Les « 15 000 postes non pourvus » étaient à l'origine une prévision : un ordre de grandeur, pas une statistique.",
        "<strong>La nuance</strong> : selon le cabinet Rehackt (janvier 2026), le marché est en « sablier » : les confirmés sont très recherchés, les juniors génériques peinent. Le junior qui a des preuves (alternance cyber, certification pratique, CTF, portfolio) s'en sort très bien.",
        "<strong>Salaires indicatifs</strong> : junior SOC ou pentest autour de 40 000 à 48 000 € brut par an en Île-de-France (sources secondaires).",
        "<strong>La régulation crée la demande</strong> : DORA, NIS2 (plus de 25 000 organisations potentiellement concernées en France selon l'ANSSI) et le ReCyF alimentent la GRC, le SOC et l'audit.",
      ])}
    `,
  },
  {
    id: "legal",
    title: "9. Le cadre légal français",
    html: `
      <p>Les articles 323-1 à 323-8 du Code pénal répriment les atteintes aux systèmes de traitement automatisé de données (STAD). Version en vigueur depuis le 26 janvier 2023 (${G.a("legifrance")}) :</p>
      ${G.table(["Article", "Infraction", "Peine maximale"], [
        ["323-1 al. 1", "Accéder ou se maintenir frauduleusement dans un STAD", "3 ans et 100 000 €"],
        ["323-1 al. 2", "Idem, avec suppression ou modification de données, ou altération du fonctionnement", "5 ans et 150 000 €"],
        ["323-1 al. 3", "Contre un STAD de données personnelles de l'État", "7 ans et 300 000 €"],
        ["323-2", "Entraver ou fausser le fonctionnement (ex. déni de service)", "5 ans et 150 000 €"],
        ["323-3", "Introduire, extraire, modifier ou supprimer frauduleusement des données", "5 ans et 150 000 €"],
        ["323-3-1", "Détenir ou diffuser sans motif légitime un outil conçu pour ces infractions", "Peines de l'infraction correspondante"],
        ["323-4-1", "Infractions en bande organisée", "10 ans et 300 000 €"],
        ["323-7", "Tentative", "Punie comme l'infraction"],
      ])}
      <h3>Ce qu'il faut retenir</h3>
      ${G.list([
        "Les sites qui citent « 2 ans et 60 000 € » sont restés sur l'ancienne version.",
        "<strong>Pas besoin de dommage</strong> : se connecter sans droit suffit, même à un système mal protégé. La simple tentative est punie.",
        "<strong>Avoir des droits ne protège pas</strong> : la Cour de cassation (2 septembre 2025, n° 24-83.605) a confirmé qu'un accès licite ne permet pas de se maintenir pour des usages étrangers à sa mission. Directement pertinent pour un correspondant informatique.",
        "Tes outils offensifs restent sur ton matériel personnel et ton lab isolé.",
        "<strong>Pratique légale</strong> = ton homelab, TryHackMe, HTB, Root-Me, Hackropole, les CTF, le périmètre déclaré des bug bounty. Un pentest professionnel exige une convention écrite.",
        "<strong>Faille trouvée par hasard</strong> sur un site tiers : ne l'exploite pas, ne télécharge rien, signale-la (programme de divulgation, ANSSI ou CERT-FR).",
        "Le RGPD s'applique dès que tu touches à des données personnelles, et le secret bancaire à tout ce que tu vois au travail.",
      ])}
    `,
  },
  {
    id: "mises-en-garde",
    title: "Mises en garde",
    html: G.list([
      "<strong>Prix</strong> : tarifs catalogue relevés en 2026, ils changent souvent. Vérifie sur le site officiel avant d'acheter.",
      "<strong>SecNumacadémie</strong> : la nouvelle version était annoncée pour 2026, disponibilité à confirmer.",
      "<strong>NIS2</strong> : la situation législative évolue en ce moment ; vérifie l'état du texte.",
      "<strong>Chiffres du marché</strong> : ceux de l'ANSSI sont solides ; les « 15 000 postes » et les salaires viennent de sources secondaires.",
      `<strong>Ton poste</strong> : les missions proposées supposent l'accord de ta hiérarchie et dépendent de l'organisation interne de ${EMPLOYEUR}.`,
      "<strong>Le rythme</strong> : 6 à 10 h par semaine en plus de l'alternance et du bachelor, c'est beaucoup. La régularité sur 24 mois bat l'intensité sur 3 mois.",
    ]),
  },
  {
    id: "sources",
    title: "Sources",
    html: G.list([
      "ANSSI : Observatoire des métiers 2025",
      `ANSSI : formations SecNumedu, SecNumacadémie (${G.a("anssi", "cyber.gouv.fr")})`,
      `ACPR : DORA (${G.a("acpr", "site de l'ACPR")})`,
      "Guide TIBER-FR 2025",
      `Légifrance : article 323-1 du Code pénal (${G.a("legifrance", "legifrance.gouv.fr")})`,
      `${G.a("fcsc", "FCSC")} · ${G.a("ctf404", "404CTF")} · ${G.a("goad", "GOAD (Orange Cyberdefense)")} · ${G.a("offsec", "OffSec : PEN-200 / OSCP")}`,
      "Rehackt : le marché cyber en 2026",
    ]),
  },
];
