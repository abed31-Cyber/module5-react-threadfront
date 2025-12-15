import React, { createContext, useState, useEffect } from 'react';

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
      const res = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

       const data = await res.json();
       if (!res.ok) {
        console.log("data error:",data.error, "data msg:",data.message)
      throw new Error(data.error || data.message || "Erreur de connexion");
    }
      // Récupération des données utilisateur après une connexion réussie
    
      setUser(data.user);
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
  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;