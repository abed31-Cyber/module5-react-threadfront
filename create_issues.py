
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# -----------------------------
# CONFIGURATION
# -----------------------------
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Récupère le token depuis le .env ou l'environnement
REPO = "abed31-Cyber/module5-react-threadfront"       # Exemple : "abed/ThreadFont"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# -----------------------------
# LISTE DES ISSUES
# -----------------------------
issues = [
    # ---------------- Sprint 1 ----------------
    {"title": "Sprint 1 - Jour 1 - Setup React Router & structure pages",
     "body": "Mettre en place BrowserRouter et les routes publiques / privées.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 1 - Création AuthContext",
     "body": "Implémenter AuthContext global avec user, isAuthenticated, login et logout.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 1 - Hydratation utilisateur via /me",
     "body": "Récupérer les informations utilisateur via /me avec fetch + gestion loading et erreur.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint1", "Backend"]},
    {"title": "Sprint 1 - Jour 1 - Layout global (Header/Footer)",
     "body": "Créer le layout responsive global avec zones auth/non-auth.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint1", "UI"]},
    {"title": "Sprint 1 - Jour 1 - Tests accès routes sans JWT",
     "body": "Vérifier que l'accès aux routes protégées sans JWT est refusé, /me sans cookie → 401.",
    "assignees": ["Alca31"],
     "labels": ["Sprint1", "Test"]},
    {"title": "Sprint 1 - Jour 2 - Page /login",
     "body": "Créer le formulaire contrôlé et POST /login.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 2 - Page /register",
     "body": "Créer le formulaire register avec validation des champs et POST /register.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 2 - PrivateRoute",
     "body": "Protéger la page /profile, redirection vers /login si non connecté.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 2 - CSS Login/Register",
     "body": "Styliser les formulaires login/register et afficher les erreurs.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint1", "UI"]},
    {"title": "Sprint 1 - Jour 2 - Tests erreurs Auth",
     "body": "Tester login mauvais identifiants et register doublon utilisateur.",
    "assignees": ["Alca31"],
     "labels": ["Sprint1", "Test"]},
    {"title": "Sprint 1 - Jour 3 - Page /profile",
     "body": "Afficher les informations utilisateur et protéger la route.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 3 - Logout utilisateur",
     "body": "POST /logout et reset AuthContext.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 3 - UI Page Profile",
     "body": "Mise en page profile, boutons d'action.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint1", "UI"]},
    {"title": "Sprint 1 - Jour 3 - Tests persistance JWT",
     "body": "Tester refresh page et logout → accès refusé.",
    "assignees": ["Alca31"],
     "labels": ["Sprint1", "Test"]},
    {"title": "Sprint 1 - Jour 4 - Gestion globale erreurs API",
     "body": "Afficher les toasts/messages pour 401 / 403 / 404.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint1", "Frontend"]},
    {"title": "Sprint 1 - Jour 4 - Centralisation fetch avec credentials",
     "body": "Gérer withCredentials par défaut sur tous les fetch.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint1", "Backend"]},
    {"title": "Sprint 1 - Jour 4 - Ajustements UI finaux",
     "body": "Vérifier cohérence visuelle et responsive.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint1", "UI"]},
    {"title": "Sprint 1 - Jour 4 - Validation finale Sprint 1",
     "body": "Checklist critères d’acceptation et rapport anomalies.",
    "assignees": ["Alca31"],
     "labels": ["Sprint1", "Test"]},
    # ---------------- Sprint 2 ----------------
    {"title": "Sprint 2 - Jour 1 - Page /feed + GET /posts",
     "body": "Afficher le feed principal en récupérant les posts via GET /posts.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 1 - Pagination / lazy-load feed",
     "body": "Mettre en place la pagination ou lazy-load du feed pour performance.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 1 - CSS Feed + PostCard",
     "body": "Styliser le feed et les PostCard, gérer état vide et responsive.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint2", "UI"]},
    {"title": "Sprint 2 - Jour 1 - Tests GET allPosts vide / feed",
     "body": "Vérifier affichage état vide si aucun post.",
    "assignees": ["Alca31"],
     "labels": ["Sprint2", "Test"]},
    {"title": "Sprint 2 - Jour 2 - Formulaire création post",
     "body": "Créer le formulaire de création post et POST /posts.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 2 - Optimistic UI post",
     "body": "Afficher le post créé immédiatement avant confirmation backend.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 2 - CSS formulaire post",
     "body": "Styliser le formulaire création post et boutons.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint2", "UI"]},
    {"title": "Sprint 2 - Jour 2 - Tests création post / redirection",
     "body": "Tester création post et redirection, vérifier utilisateur non authentifié.",
    "assignees": ["Alca31"],
     "labels": ["Sprint2", "Test"]},
    {"title": "Sprint 2 - Jour 3 - Page /posts/:postId",
     "body": "Afficher le détail du post et ses commentaires.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 3 - Formulaire commentaire",
     "body": "Ajouter un formulaire pour poster un commentaire via POST /posts/:postId/comments.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 3 - CSS PostDetail & CommentList",
     "body": "Styliser la page post détail et la liste de commentaires.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint2", "UI"]},
    {"title": "Sprint 2 - Jour 3 - Tests commentaires / redirection non-auth",
     "body": "Tester l’ajout de commentaire et redirection si utilisateur non connecté.",
    "assignees": ["Alca31"],
     "labels": ["Sprint2", "Test"]},
    {"title": "Sprint 2 - Jour 4 - Vérification mapping API → frontend",
     "body": "Vérifier que toutes les actions frontend correspondent aux routes API.",
    "assignees": ["Gaetan1303"],
     "labels": ["Sprint2", "Frontend"]},
    {"title": "Sprint 2 - Jour 4 - Ajustements UI finaux feed & post",
     "body": "Harmonisation visuelle et responsive des pages feed et post.",
    "assignees": ["stephanie-28"],
     "labels": ["Sprint2", "UI"]},
    {"title": "Sprint 2 - Jour 4 - Centralisation fetch & gestion erreurs",
     "body": "Centraliser tous les appels API et gérer les erreurs globalement.",
    "assignees": ["abed31-Cyber"],
     "labels": ["Sprint2", "Backend"]},
    {"title": "Sprint 2 - Jour 4 - Tests E2E posts / commentaires",
     "body": "Tester tous les parcours posts et commentaires manuellement.",
    "assignees": ["Alca31"],
     "labels": ["Sprint2", "Test"]},
]

# -----------------------------
# CRÉATION DES ISSUES
# -----------------------------
for issue in issues:
    url = f"https://api.github.com/repos/{REPO}/issues"
    response = requests.post(url, headers=HEADERS, json=issue)
    if response.status_code == 201:
        print(f"Issue créée : {issue['title']}")
    else:
        print(f"Erreur : {issue['title']}, {response.status_code}, {response.json()}")
