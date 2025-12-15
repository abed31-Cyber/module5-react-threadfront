import { useState, useContext } from "react";
import { toast } from 'react-toastify';
import { triggerCatErrorEffect } from '../utils/catEffect';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
    const { login, error } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    // const [error, setError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setError("");
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
                toast.error("😿 Erreur lors de la connexion");
                triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            toast.error("😿 Erreur serveur lors de la connexion");
            triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
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
                    {/* Erreur affichée uniquement via toast + effet chat */}
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
