import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MessageError({ message }) {
    return <p style={{ color: 'red' }}>{message}</p>;
}
// Composant d'enregistrement d'un nouvel utilisateur
export default function Register() {
    const [pseudoUser, setPseudoUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    // je gère la soumission du formulaire pour eviter le rechargement de la page
    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        // je vérifie que les mots de passe correspondent
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }
        // j'envoie les données au serveur pour créer un nouveau compte en utilisant fetch
        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: pseudoUser,
                    email,
                    password,
                    role: "User"
                }),
                credentials: "include" // pour les cookies JWT
            });
            // je traite la réponse du serveur pour afficher un message de succès ou d'erreur
            const data = await res.json();
            // si la réponse est ok, le compte est créé avec succès
            if (res.ok) {
                setSuccess("Compte créé avec succès !");
                setPseudoUser("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                navigate('/Login');
            } else {
                setError(data.message || "Erreur lors de la création du compte");
            }
        } catch (error) {
            console.error("Erreur lors de la création du compte :", error);
            setError("Erreur serveur");
        }
    };

    return (
        <div>
            <h2>Création de compte</h2>
            {error && <MessageError message={error} />}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handlesubmit}>
                <input type="text" placeholder="@Pseudo" value={pseudoUser} onChange={e => setPseudoUser(e.target.value)} required />
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
                <input type="password" placeholder="mot de passe encore" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="submit">Créer un compte</button>
            </form>
              <Link to="/login">Déjà un compte ? Connectez-vous</Link>
        </div>
    );
}