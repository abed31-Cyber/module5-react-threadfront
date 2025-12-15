import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import './post.css';
import AuthContext from '../../../context/AuthContext';

const PostDetail = () => {

  const { user, isAuthenticated } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        console.log('API response:', data);
        setPost(data); // L'API renvoie directement l'objet post, pas data.post
      } catch (err) {
        console.error('Erreur lors de la récupération:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div>Aucun détail disponible pour ce post.</div>;
  }

  // ...existing code...

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");
    if (!commentContent.trim()) {
      setCommentError("Le commentaire ne peut pas être vide.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: commentContent })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du commentaire");
      setCommentSuccess("Commentaire ajouté !");
      setCommentContent("");
      // Rafraîchir les commentaires
      const updated = await res.json();
      setPost((prev) => ({ ...prev, Comments: [...(prev.Comments || []), updated] }));
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Vérifier si l'utilisateur peut supprimer le post
  const canDeletePost = isAuthenticated && (user?.user?.id === post.User?.id || user?.user?.role === 'admin' || user?.role === 'admin');

  const handleDeletePost = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du post");
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="post-detail">
      <h1 className="post-title">Détail du Post</h1>
      <div className="post-meta">
        <p className="post-author">Auteur : {post.User?.username || 'Anonyme'}</p>
        <p className="post-date">Créé le : {new Date(post.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {canDeletePost && (
          <button onClick={handleDeletePost} className="delete-btn" style={{marginLeft:8}}>
            Supprimer le post
          </button>
        )}
      </div>
      <div className="post-comments">
        <h2>Commentaires</h2>
        {post.Comments && post.Comments.length > 0 ? (
          <ul>
            {post.Comments.map((comment) => {
              const canDeleteComment = isAuthenticated && (
                (user?.user?.id === comment.User?.id) || user?.user?.role === 'admin' || user?.role === 'admin'
              );
              const handleDeleteComment = async () => {
                if (!window.confirm('Supprimer ce commentaire ?')) return;
                try {
                  const res = await fetch(`http://localhost:3000/comments/${comment.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  if (!res.ok) throw new Error("Erreur lors de la suppression du commentaire");
                  // Retirer le commentaire du state
                  setPost((prev) => ({
                    ...prev,
                    Comments: prev.Comments.filter((c) => c.id !== comment.id)
                  }));
                } catch (err) {
                  alert(err.message);
                }
              };
              return (
                <li key={comment.id} style={{display:'flex',alignItems:'center',gap:8}}>
                  <p style={{margin:0}}><strong>{comment.User?.username || 'Anonyme'} :</strong> {comment.content}</p>
                  {canDeleteComment && (
                    <button onClick={handleDeleteComment} className="delete-btn" style={{marginLeft:8}}>
                      Supprimer
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucun commentaire pour ce post.</p>
        )}
        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} style={{marginTop:16}}>
            <textarea
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder="Votre commentaire..."
              rows={3}
              style={{width:'100%',borderRadius:8,padding:8}}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting} style={{marginTop:8}}>
              {submitting ? 'Envoi...' : 'Commenter'}
            </button>
            {commentError && <div className="error-message">{commentError}</div>}
            {commentSuccess && <div style={{color:'green'}}>{commentSuccess}</div>}
          </form>
        )}
        {!isAuthenticated && (
          <div style={{marginTop:16, color:'#888'}}>Connectez-vous pour commenter ce post.</div>
        )}
      </div>
      {/* Navigation Buttons */}
      <div className="bottom-navigation">
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
        <button 
          className="nav-button profile-button" 
          onClick={() => navigate('/profile')}
          aria-label="Profil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PostDetail;