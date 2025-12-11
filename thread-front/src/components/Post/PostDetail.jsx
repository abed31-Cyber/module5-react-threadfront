import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import './post.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        console.log('Fetching post with ID:', postId);
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du post');
        }

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

  return (
    <div className="post-detail">
      <h1 className="post-title">Détail du Post</h1>
      <div className="post-meta">
        <p className="post-author">Auteur : {post.User?.username || 'Anonyme'}</p>
        <p className="post-date">Créé le : {new Date(post.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-comments">
        <h2>Commentaires</h2>
        {post.Comments && post.Comments.length > 0 ? (
          <ul>
            {post.Comments.map((comment) => (
              <li key={comment.id}>
                <p><strong>{comment.User?.username || 'Anonyme'} :</strong> {comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun commentaire pour ce post.</p>
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