import { useState, useEffect } from "react";
import "./comment.css";

export default function Commentary(userNameProps, commentaryProps)
{
const[userName, setUsername]=useState("");
const [comment, setComment]=useState({});

function formatDate(createdAt) {
    const dateOf = new Date(createdAt);

    let hour = dateOf.getHours();
    let minute = dateOf.getMinutes();
    
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;

    const day = dateOf.getDate();
    const month = dateOf.toLocaleString("fr-FR", { month: "short" });
    const year = dateOf.getFullYear().toString().slice(2);// 2025 → 25

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
