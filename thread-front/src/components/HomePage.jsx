import { Link } from "react-router-dom";

export default function HomePage(){
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <Link to="/register">Créer un compte</Link>
        </div>
    )
}