const { useState } = require("react")


// Composant pour afficher le message d'erreur
function MessageError() {
    return <p style={{ color: 'red' }}>Les mots de passe ne correspondent pas !</p>;
}

// Composant principal d'enregistrement de l'utilisateur
export default function Register() {

    // États pour stocker les valeurs des champs du formulaire
    const [pseudoUser, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Fonction de gestion de la soumission du formulaire qui empeche le rechargement de la page
    const handlesubmit = (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
        } catch (error) {
            console.error(error);
        }
    }
    // Retourne le rendu du formulaire d'enregistrement
    return (

        <div>
            <h2>Création de compte</h2>

            {confirmPassword && password !== confirmPassword ? <MessageError /> : null}
            <form onSubmit={handlesubmit}>
                <input type="pseudo" placeholder="@Pseudo" value={pseudoUser} onChange={e => setPseudoUser(e.target.value)} />
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
                <input type="password" placeholder="mot de passe encore" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button type="submit">Créer un compte</button>
            </form>
        </div>
    );

}