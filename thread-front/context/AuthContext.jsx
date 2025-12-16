import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// Create AuthContext 
const AuthContext = createContext();
// creation de la fonction AuthProvider pour englober l'application dans le contexte d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

// la fonction de connexion pour authentifier l'utilisateur dans toute l'application 
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
       const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Erreur 401 : Identifiants invalides');
        }else {
          toast.error("erreur lors de la connexion");
          throw new Error('Erreur lors de la connexion:'+data.error || data.message || "Erreur de connexion");
        }
       
      }

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