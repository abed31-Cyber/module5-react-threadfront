import { useState, useEffect } from "react";
import "./comment.css";

export default function Commentary(userNameProps, commentaryProps)
{
const[userName, setUsername]=useState("");
const [comment, setComment]=useState({});

useEffect(()=>
{
 setUsername(userNameProps)??setUsername("Joline");
 setComment(commentaryProps)??setComment({id: 3, content: "je veut plus te voir", userId:3, postId:2 });
});
return(
    <div className="comment">
        <strong><h4>@{userName}</h4></strong>
          <p>{comment.content}</p>
    </div>
)
}
