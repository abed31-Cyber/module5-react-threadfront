import { useState, useEffect, useContext } from "react";
import AuthContext from "../../../context/AuthContext";


export default function Profile() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = user.user?.id || user.id;

        // Récupérer tous les posts de l'utilisateur
        const postsResponse = await fetch(`http://localhost:3000/users/${userId}/posts`, {
          credentials: 'include'
        });

        if (!postsResponse.ok) {
          throw new Error('Erreur lors de la récupération des posts');
        }

        const userPosts = await postsResponse.json();

        // Récupérer les détails complets de chaque post avec les commentaires
        const postsWithComments = await Promise.all(
          userPosts.map(async (post) => {
            const postResponse = await fetch(`http://localhost:3000/posts/${post.id}`, {
              credentials: 'include'
            });
            if (postResponse.ok) {
              return await postResponse.json();
            }
            return post;
          })
        );

        setPosts(postsWithComments);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDelete = async (postId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post?')) {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Erreur lors de la suppression du post');
      }
    }
  };

  const handleUpdate = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: editContent })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }

      const data = await response.json();
      setPosts(posts.map(p => p.id === postId ? data.post : p));
      setEditingPostId(null);
      setEditContent("");
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Erreur lors de la modification du post');
    }
  };

  function renderPost(post) {
    const relatedComments = post.Comments || [];
    const isEditing = editingPostId === post.id;

    return (
      <div key={post.id} className="post">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-textarea"
              rows="4"
            />
            <div className="edit-buttons">
              <button onClick={() => handleUpdate(post.id)} className="save-btn">
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setEditingPostId(null);
                  setEditContent("");
                }}
                className="cancel-btn"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="post-header">
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setEditContent(post.content);
                  }}
                  className="edit-btn"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          </>
        )}

        {!isEditing && relatedComments.length > 0 && (
          <>
            <h4>Commentaires :</h4>
            {relatedComments.map(comment => (
              <div key={comment.id} className="comment">
                <strong>@{comment.User?.username || 'Utilisateur inconnu'}</strong>
                <p>{comment.content}</p>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="error-message">Erreur : {error}</div>;
  }

  if (!user) {
    return <div className="error-message">Vous devez être connecté pour voir votre profil</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <h2>@{user.user?.username || user.username}</h2>

      {posts.length === 0 ? (
        <p>Vous n'avez pas encore de posts</p>
      ) : (
        posts.map(renderPost)
      )}
    </div>
  );
}
