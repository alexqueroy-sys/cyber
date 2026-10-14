# Feuille de route cyber 2026-2028

Site personnel pour suivre ta feuille de route cybersécurité. En ligne : https://alexqueroy-sys.github.io/cyber/

Il contient trois sections :

- **Par où commencer** (accueil) : la prochaine petite étape à faire et la grande étape dont elle fait partie, les 5 actions de la semaine, puis tout le parcours par phase. Chaque grande étape s'ouvre sur ses petites étapes, que tu coches ou passes au fur et à mesure.
- **Feuille de route** : la vue générale de la cyber, avec les grandes étapes sur 24 mois (frise et phases), les 9 fondamentaux, les meilleurs sites et les certifications. Un clic sur une certification affiche son prix, où la passer et ses modalités.
- **Mes travaux** : tes notes (en Markdown), tes liens et tes fichiers, reliés aux grandes étapes.

Le site est entièrement statique : pas de serveur, pas de compte, aucune requête vers un site tiers.

## Où sont tes données ?

Ta progression, tes notes, tes travaux et tes fichiers sont enregistrés **uniquement dans ton navigateur**, sur l'appareil que tu utilises. Rien n'est envoyé sur GitHub ni ailleurs.

Conséquences :

- Sur un autre appareil ou un autre navigateur, tu repars de zéro. Pour y retrouver tes données, utilise **Réglages → Exporter**, puis **Importer** sur l'autre appareil.
- Si tu effaces les données de navigation, tout disparaît. **Exporte régulièrement** : le site te le rappelle chaque semaine.

## Mettre le site en ligne avec GitHub Pages

Tu n'as pas besoin d'installer Git : tout se fait depuis le site de GitHub.

1. Crée un compte sur [github.com](https://github.com) (gratuit).
2. Clique sur **New repository** :
   - Nom : `feuille-de-route-cyber` (ou le nom de ton choix)
   - Visibilité : **Public**. C'est obligatoire pour GitHub Pages avec un compte gratuit.
   - Clique sur **Create repository**.
3. Sur la page du dépôt, clique sur **uploading an existing file**. Glisse-dépose ensuite le contenu du dossier du site : `index.html`, le dossier `assets`, `.nojekyll`, `robots.txt` et `README.md`. Clique sur **Commit changes**.
4. Va dans **Settings → Pages**. Sous **Build and deployment**, choisis **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`. Clique sur **Save**.
5. Après une à deux minutes, le site est accessible à l'adresse :
   `https://TON-PSEUDO.github.io/feuille-de-route-cyber/`

Pour mettre le site à jour, téléverse à nouveau les fichiers modifiés de la même façon. Tes données ne sont pas touchées : elles sont dans ton navigateur, pas dans les fichiers.

### Ce qui est public

Avec un dépôt public, **tout le monde peut lire le contenu du site** : la feuille de route et le code. Tes données personnelles (progression, notes, travaux, fichiers), elles, ne sont jamais publiées.

Le site demande aux moteurs de recherche de ne pas l'indexer (balise `noindex`). Il reste accessible à toute personne qui a l'adresse.

**Contenu anonymisé** : le site écrit « ton employeur » au lieu d'un nom. Le réglage se trouve en haut de `assets/js/data.js` (constante `EMPLOYEUR`), et toutes les phrases s'adaptent si tu le changes. Garde en tête qu'un nom mis là devient public.

## Ouvrir le site sans Internet

Double-clique sur `index.html` : le site fonctionne aussi en local. Attention, les données enregistrées en local sont distinctes de celles du site en ligne. Passe par l'export et l'import pour les transférer.

## Passer à Cloudflare plus tard

Le jour où tu veux un site privé et synchronisé entre tes appareils :

1. Le même dossier se déploie tel quel sur **Cloudflare Pages**.
2. **Cloudflare Access** protège l'accès : connexion par code reçu par e-mail, sans compte Claude.
3. Le fichier `assets/js/store.js` sera remplacé par une version qui enregistre dans une base Cloudflare (D1 pour les données, R2 pour les fichiers). Le reste du site ne change pas.
4. Ta progression actuelle sera récupérée grâce à ton fichier d'export.

## Structure

```
index.html            Page unique
assets/css/style.css  Style (thème clair et sombre)
assets/js/data.js     Le contenu : grandes et petites étapes, fondamentaux, sites, certifications
assets/js/md.js       Mise en forme Markdown des notes, sans dépendance
assets/js/store.js    Stockage local, export et import
assets/js/app.js      Interface
```
