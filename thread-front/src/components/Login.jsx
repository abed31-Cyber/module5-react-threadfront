import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
export default function Login() {
    const [email, setEmail] = useState ("");
    const [password, setPassWord] = useState ("");
    // const [error, setError] = useState("");
    const handleSubmit = (email) => {
        email.preventDefault();
        console.log("Email", email);
        console.log("Mot de pass :", password);
        alert("Formulaire Envoyer !");
    };
  return (
    <div className="connecter">
      <form onSubmit={handleSubmit}>
        <h2>|Connexion</h2>
        <input type="email" placeholder="Email" value={email} onChange={(email) => setEmail(email.target.value)} />
        < br/>
        <input type="password" placeholder="**********" value={password} onChange={(password) => setPassWord(password.target.value)} />
        < br/>
        <button type="submit">Se connecter</button>
        < br/>
        <Link to="/register">Se créer un compte.</Link>
      </form>
    </div>
  );
}