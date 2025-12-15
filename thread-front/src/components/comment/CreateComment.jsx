import { useState } from "react";
import PostCard from "../Post/PostCard";
import "./createComment.css";

export default function CreateComment() {
  const user = {
    pseudo: "vous",
  };
  const [text, setText] = useState("");
  const date = new Date();
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
const handlePost = async (event) => {
  event.preventDefault();
  const commentaire = {
    pseudo: user.pseudo,
    message: text,
    date: Date.now(),
  };
  try {
    const response = await fetch("http://localhost:3000/api/commentaires", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentaire),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi");
    }
    console.log("Commentaire :", commentaire);
    setText("");
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="create-comment">
      <form className="boite-a-commentaire" onSubmit={handlePost}>
      <div className="textarea-container">
      <h3 className="title-comment">@{user.pseudo}</h3>
      <textarea placeholder=" Tapez votre commentaire ici ..." value={text} cols={50} rows={3} onChange={(event) => setText(event.target.value)} />
      <p className="Hours-comment"> {date.getHours()} : {date.getMinutes()} — {date.getDate()}{" "} {months[date.getMonth()]} {date.getFullYear()}</p>
      </div>
      <button className="commentaire-bouton">V</button>
      </form>
    </div>
  );
}