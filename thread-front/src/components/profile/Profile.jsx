import { useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import './Profile.css';
export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = user.user?.id || user.id;

        const postsResponse = await fetch(`http://localhost:3000/users/${userId}/posts`, {
          credentials: 'include'
        });

        if (!postsResponse.ok) {
          if (postsResponse.status === 401) toast.error('😾 Mrrrow ! Tu n’es pas autorisé à voir ces posts.');
          else if (postsResponse.status === 403) toast.error('😼 Grrr ! Accès refusé, ce territoire n’est pas pour toi.');
          else if (postsResponse.status === 404) toast.error('🐾 Miaou ? Ces posts sont introuvables, essaie ailleurs !');
          else toast.error('😿 Oups, impossible de récupérer les posts.');
          throw new Error('Erreur lors de la récupération des posts');
        }

        const userPosts = await postsResponse.json();
        setPosts(userPosts);
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
          if (response.status === 401) toast.error('😾 Mrrrow ! Tu n’as pas le droit de griffer ce post.');
          else if (response.status === 403) toast.error('😼 Grrr ! Ce post est protégé, pas touche !');
          else if (response.status === 404) toast.error('🐾 Miaou ? Ce post a disparu, introuvable !');
          else toast.error('😿 Impossible de supprimer ce post.');
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
        if (response.status === 401) toast.error('😾 Mrrrow ! Tu n’as pas le droit de modifier ce post.');
        else if (response.status === 403) toast.error('😼 Grrr ! Modification interdite, ce n’est pas ta litière.');
        else if (response.status === 404) toast.error('🐾 Miaou ? Ce post n’existe plus, va voir ailleurs !');
        else toast.error('😿 Impossible de modifier ce post.');
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
      <h1>| Profile</h1>
      <h2>@{user.user?.username || user.username}</h2>

      {/* Dernier post */}
      {posts.length > 0 && (
        <div className="last-post">
          <div className="post-item">
            <p>{posts[0].content}</p>
            <span>{new Date(posts[0].createdAt).toLocaleString('fr-FR')}</span>
          </div>
        </div>
      )}

      {/* Nombre total de posts */}
      <div className="post-count">
        <span>{posts.length}</span>
        <svg className="messenger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      {/* Liste des posts */}
      <div className="all-posts">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            {editingPostId === post.id ? (
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
                <p>{post.content}</p>
                <span>{new Date(post.createdAt).toLocaleString('fr-FR')}</span>
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
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="bottom-nav">
        <button 
          className="nav-button create-button" 
          onClick={() => navigate('/createpost')}
          aria-label="Créer un post"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <div  className="deco-button">
          <button onClick={logout} aria-label="Déconnexion">
            <img src="/src/assets/icons/logout.svg" alt="Déconnexion" width="24" height="24" />
          </button>
        </div>

        <button 
          className="nav-button feed-button" 
          onClick={() => navigate('/feed')}
          aria-label="Bulle de discussion"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
