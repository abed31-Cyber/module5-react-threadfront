import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Vérification simple
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    // Vérification email basique
    if (!email.includes("@")) {
      setError("Adresse email invalide.");
      return;
    }
    // Si tout est bon = pas d'erreur
    setError("");

    console.log("Email :", email);
    console.log("Mot de passe :", password);
    alert("Formulaire envoyé !");
  };

  return (
    <div className="connecter">
      <form onSubmit={handleSubmit}>
        <h2>|Connexion</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="email" placeholder="email" value={email} onChange={(email) => setEmail(email.target.value)} />
        <br />
        <input type="password" placeholder="**********" value={password} onChange={(password) => setPassWord(password.target.value)} />
        <br />
        <button type="submit">Se connecter</button>
        <br />
        <Link to="/register">Se créer un compte.</Link>
      </form>
    </div>
  );
}