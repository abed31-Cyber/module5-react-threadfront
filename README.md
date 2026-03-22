# module5-react-threadfront

Frontend React d'une mini app de réseau social type "Threads". C'est le module 5 d'un projet plus large, le back est dans un repo séparé (`module4-nodejs-threadapi`).

---

## C'est quoi ce projet

Une app web où on peut créer un compte, se connecter, poster des messages courts, commenter les posts des autres, et gérer son profil. Un peu comme Threads/Twitter mais en version projet d'école.

C'est fait pour pratiquer React avec un vrai back-end (Node.js + Express + MySQL via Sequelize) en mode fullstack.

---

## Stack

**Frontend**
- React 19
- Vite
- React Router DOM v7
- React Toastify (pour les notifs)

**Backend** (repo séparé)
- Node.js / Express 5
- Sequelize + MySQL
- JWT (cookies httpOnly)
- bcrypt

---

## Installation

### Prérequis
- Node.js installé
- Le back lancé sur `http://localhost:3000` (voir repo `module4-nodejs-threadapi`)

### Frontend

```bash
cd thread-front
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173` par défaut.

Si besoin de changer l'URL de l'API, créer un `.env` :

```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Fonctionnalités

- Inscription / connexion (JWT en cookie httpOnly)
- Feed avec scroll infini (Intersection Observer)
- Création de post depuis le feed ou une page dédiée
- Post optimiste (le post s'affiche direct, disparaît si erreur)
- Détail d'un post avec ses commentaires
- Ajout / suppression de commentaires
- Page profil avec liste de ses posts, édition et suppression
- Routes privées (redirige si pas connecté)
- Notifs d'erreur avec son de chat 🐱 + animation de griffe (oui vraiment)

---

## Le truc fun (ou chelou selon les goûts)

Chaque erreur déclenche un son de chat différent selon le type d'erreur (401, 403, 404...) et une animation de griffe qui sort de l'écran. C'était une idée un peu random mais ça rend l'app moins sèche quand ça plante.

---

## Limites / problèmes connus

- L'URL de l'API est en dur à `http://localhost:3000` dans plusieurs composants (pas partout géré via `.env`)
- Pas de pagination côté profil, tous les posts chargent d'un coup
- Pas de gestion des images / médias dans les posts
- Le `PostDetail.propTypes` déclare `postId` comme required mais le composant utilise `useParams()` — c'est une erreur, ça génère un warning
- Pas de tests du tout
- Le nav est commenté dans `App.jsx`, la navigation se fait uniquement via les boutons en bas de page

---

## TODO (si j'y reviens)

- [ ] Centraliser l'URL de l'API dans un seul fichier
- [ ] Ajouter les likes sur les posts
- [ ] Gérer le profil des autres utilisateurs (voir les posts de quelqu'un d'autre)
- [ ] Pagination sur la page profil
- [ ] Quelques tests au moins pour le contexte auth
- [ ] Corriger le PropTypes de PostDetail

---

## Ce que j'ai appris / galéré

Le scroll infini avec `IntersectionObserver` c'était pas évident à gérer proprement avec les effets React. Le post optimiste aussi m'a pris du temps, surtout pour bien rollback en cas d'erreur sans casser l'état.

La partie auth avec le contexte React et les cookies httpOnly c'est quelque chose que j'avais jamais fait avant, ça m'a aidé à comprendre comment ça marche vraiment côté browser.
