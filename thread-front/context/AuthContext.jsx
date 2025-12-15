import { toast } from 'react-toastify';

// Create AuthContext 
const AuthContext = createContext();
// creation de la fonction AuthProvider pour englober l'application dans le contexte d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Au chargement, vérifier si un utilisateur est déjà stocké dans le localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Erreur de parsing du JSON depuis localStorage", e);
      // Gérer l'erreur, par exemple en vidant le localStorage corrompu
      localStorage.removeItem('user');
    }
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois au montage

// la fonction de connexion pour authentifier l'utilisateur dans toute l'application 
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Erreur 401 : Identifiants invalides');
        } else if (res.status === 403) {
          toast.error('Erreur 403 : Accès refusé');
        } else if (res.status === 404) {
          toast.error('Erreur 404 : Ressource non trouvée');
        } else {
          toast.error('Erreur lors de la connexion');
        }
        throw new Error('Erreur lors de la connexion');
      }
      const userData = await res.json();
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('user');
      return false;
    }
  };
// la fonction de déconnexion pour gérer la déconnexion de l'utilisateur dans toute l'application
  const logout = () => {
    localStorage.removeItem('user'); // Supprimer de localStorage
    setUser(null);
    setError(null);
  };
// Fournir le contexte d'authentification aux composants enfants
  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;