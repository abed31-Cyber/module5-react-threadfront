import { useState } from "react";
import "./createComment.css";

export default function CreateComment() {
  const [text, setText] = useState("");
  const date = new Date();
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  const handlePost = (event) => {
    event.preventDefault();
    console.log("Commentaire :", text);
    setText("fullDate"); 
  };

  return (
    <div className="create-comment">
      <h2 className="title-comment">|New Post</h2>
      <form className="boite-a-commentaire" onSubmit={handlePost}>
          <textarea placeholder=" Tapez votre commentaire ici ..." value={text} cols={50} rows={15} onChange={(e) => setText(e.target.value)} />
          <p className="Hours-comment">{date.getHours()} : {date.getMinutes()} —  {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</p>
          <button className="commentaire-bouton">Poster !</button>
      </form>
    </div>
  );
}