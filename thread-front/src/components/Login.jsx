import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");

        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");
        const navigate = useNavigate(); // Ajoute ce hook

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");
            setSuccess("");
            try {
                const res = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    credentials: "include"
                });
                const data = await res.json();
                if (res.ok) {
                    setSuccess("Connexion réussie !");
                    setTimeout(() => {
                        navigate("/feed"); // Redirection après succès
                    }, 1000);
                } else {
                    setError(data.message || "Erreur lors de la connexion");
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                setError("Erreur serveur");
            }
        };

        return (
            <div className="connecter">
                <form onSubmit={handleSubmit}>
                    <h2>|Connexion</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="**********"
                        value={password}
                        onChange={e => setPassWord(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Se connecter</button>
                    <br />
                    <Link to="/register">Se créer un compte.</Link>
                </form>
            </div>
        );
    }
