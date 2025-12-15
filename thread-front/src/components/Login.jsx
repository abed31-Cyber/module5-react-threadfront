import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
    const { login, error } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccess("");
        try {
            const success = await login({ email, password });
            if (success) {
                setSuccess("Connexion réussie !");
                setTimeout(() => {
                    navigate("/feed");
                }, 1000);
            } else {
                setErrorMsg(error);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion 2 :", errorMsg);
            setErrorMsg("Erreur serveur");
        }
    };

        return (
            <div className="connecter">
                <form onSubmit={handleSubmit}>
                    <h2>|Connexion</h2>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
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
                    <Link to="/feed"></Link>
                </form>
            </div>
        );
    }
