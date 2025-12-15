import React, { createContext, useState, useEffect } from 'react';

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
        // appel de l'API pour authentifier l'utilisateur dans la base de données et gérer la session
      const res = await fetch(`http://localhost:3000/login`, {
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
      localStorage.setItem('user', JSON.stringify(userData)); // Sauvegarder dans localStorage
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('user'); // S'assurer que tout est nettoyé en cas d'erreur
      return false;
    }
  };
// la fonction de déconnexion pour gérer la déconnexion de l'utilisateur dans toute l'application
  const logout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // Optionnel : log l'erreur mais on continue le reset local
      console.error('Erreur lors du logout serveur', e);
    }
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