import { useState, useEffect } from "react";
import "./comment.css";

export default function Commentary(userNameProps, commentaryProps)
{
const[userName, setUsername]=useState("");
const [comment, setComment]=useState({});

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


useEffect(()=>
{
 setUsername(userNameProps)??setUsername("Joline");
 setComment(commentaryProps)??setComment({id: 3, content: "je veut plus te voir", userId:3, postId:2 });
});
return(
    <div className="comment">
        <strong><h4>@{userName}</h4></strong>
          <p>{comment.content}</p>
          <p>{formatDate(comment.createdAt)}</p>
    </div>
)
}
