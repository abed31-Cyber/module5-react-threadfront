import  React, { createContext, useState } from 'react'; 'react';

// Create AuthContext 
const AuthContext = createContext();
// creation de la fonction AuthProvider pour englober l'application dans le contexte d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
// la fonction de connexion pour authentifier l'utilisateur dans toute l'application 
  const login = async ({ email, password }) => {
    try {
        // appel de l'API pour authentifier l'utilisateur dans la base de données et gérer la session
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('Identifiants invalides');
      }
      // Récupération des données utilisateur après une connexion réussie
      const userData = await res.json();
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setUser(null);
      return false;
    }
  };
// la fonction de déconnexion pour gérer la déconnexion de l'utilisateur dans toute l'application
  const logout = () => {
    setUser(null);
    setError(null);
  };
// Fournir le contexte d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;