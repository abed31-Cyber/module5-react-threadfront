import { useState, useEffect } from "react";

export default function Profile() {
  const [userName, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    // Données mock
    const userObj = { id: 1, name: "billy" };

    const otherUserObj = [
      { id: 2, name: "joe" },
      { id: 3, name: "joline" },
    ];

    const postObj = [
      { id: 1, title: "zut", content: "Joe m'embête" },
      { id: 2, title: "zut2", content: "il me casse les pieds" },
      
    ];

    const commentObj = [
      { id: 1, title: "nananère", content: "et alors?", userId: 2, postId: 1 },
      { id: 2, title: "bahahaha", content: "je signerais ton plâtre", userId: 2, postId: 2},
      { id: 3, title: "tu es infernal joe", content: "je veut plus te voir", userId:3, postId:2 }
    ];

    setUsername(userObj.name);
    setPosts(postObj);
    setComments(commentObj);
    setOtherUsers(otherUserObj);
  }, []);

  /**
   * 
   * @param {user} id //l'id de l'user
   * @returns user.name //l'auteur du commentaire
   */
  function getUserNameById(id) {
    for (let i = 0; i < otherUsers.length; i++) {
      if (otherUsers[i].id === id) 
      return otherUsers[i].name;
    }
    return "Utilisateur inconnu";
  }
/**
 * 
 * @param {userPost} post //les post de l'user en bdd
 * @returns posts.comments //les commentaires lié aux posts en questions.
 */
  function renderPost(post) {
  const relatedComments = comments.filter(c => c.postId === post.id);

  return (
    <div key={post.id} className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>

       <h4>Commentaires :</h4>

      {relatedComments.map(comment => (
        <div key={comment.id} className="comment">
          <strong>@{getUserNameById(comment.userId)}</strong>
          <h5>{comment.title}</h5>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

  return (
    <div>
    <h1>Profile</h1>
    <h2>@{userName}</h2>

    {posts.map(renderPost)}
  </div>
  );
}
