import { createContext, useState, useEffect } from 'react';
import Spinner from '../src/components/Spinner.jsx';
// Création du contexte d'authentification
const AuthContext = createContext();
// je fournis le contexte d'authentification à mon application 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Vérification de l'état d'authentification lors du démarrage de l'application
  useEffect(() => {
    // Fonction pour récupérer l'utilisateur authentifié
    const fetchUser = async () => {
      try {
        // Appel à l'API pour vérifier l'état d'authentification de l'utilisateur
        const response = await fetch('http://localhost:3000/me', {
          credentials: 'include',
        });
        // Si la réponse est correcte, on met à jour l'état de l'utilisateur
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    // Appel de la fonction pour récupérer l'utilisateur au montage du composant
    fetchUser();
  }, []);
  // fonction de connexion incluant la gestion des erreurs
  const login = async ({ email, password }) => {
    try {
      // Appel à l'API pour se connecter avec les informations d'identification fournies
      const res = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      // Récupération des données de la réponse
       const data = await res.json();
      // Si la réponse n'est pas correcte, on lance une erreur avec le message approprié
      if (!res.ok) {
        throw new Error('Erreur lors de la connexion:'+data.error || data.message || "Erreur de connexion");
      }
    // Mise à jour de l'état de l'utilisateur et réinitialisation des erreurs
      setUser(data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setUser(null);

      return false;
    }
  };
// fonction de déconnexion avec gestion des erreurs
  const logout = async () => {
    try {
      // Appel à l'API pour se déconnecter
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Erreur lors du logout serveur', e);
    }

    setUser(null);
    setError(null);
  };
  // on détermine si l'utilisateur est authentifié, si l'objet user n'est pas null
  const isAuthenticated = !!user;
  // Affichage d'un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return <Spinner />;
  }
// on fournit le contexte d'authentification aux composants enfants precedement enveloppés par le AuthProvider
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, error, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;