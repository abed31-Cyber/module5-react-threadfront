import { useState, useEffect } from "react";
import "./comment.css";

export default function Commentary({ userNameProps, commentaryProps }) {
    const [userName, setUsername] = useState("");
    const [comment, setComment] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setUsername(userNameProps ?? "Utilisateur inexistant");
        setComment(
            commentaryProps ??
            { id: 0, content: "message par défaut", createdAt: new Date().toISOString() }
        );
    }, [userNameProps, commentaryProps]);


    function formatDate(createdAt) {
        const dateOfCreation = new Date(createdAt);
        let hour = dateOfCreation.getHours();
        let minute = dateOfCreation.getMinutes();
        if (hour < 10) hour = "0" + hour;
        if (minute < 10) minute = "0" + minute;
        const day = dateOfCreation.getDate();
        const month = dateOfCreation.toLocaleString("fr-FR", { month: "short" });
        const year = dateOfCreation.getFullYear().toString().slice(2);// 2025 → 25 
        return `${hour}:${minute} - ${day} ${month} ${year}`;
    }

    async function deleteComment(commentId) {
        const res = await fetch(`http://localhost:3000/comment/${commentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");

        console.log("SUPPRIMÉ :", data);
        return data;
    }

    function DeletePopup() {
        if (!showConfirm) return null;

        return (
            <div className="delete-comment">
                <p>Vous êtes sûr de supprimer ?</p>

                <button
                    onClick={() => {
                        deleteComment(comment.id);
                        setShowConfirm(false);
                    }}
                >
                    V
                </button>

                <button onClick={() => setShowConfirm(false)}>X</button>
            </div>
        );
    }


    // -----------------------
    // RENDER
    // -----------------------
    return (
        <div className="comment">
            <strong><h4>@{userName}</h4></strong>

            <p>{comment.content}</p>

            <p>{formatDate(comment.createdAt)}</p>

            {/* Attention ici: onClick DOIT être une fonction */}
            <button onClick={() => setShowConfirm(true)}>supprimer</button>

            {/* POPUP CONFIRMATION */}
            {DeletePopup()}

        </div>
    );
}

