import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './post.css';

const PostDetail = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du post');
        }

        const data = await response.json();
        setPost(data.post);
      } catch (err) {
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
      <h1 className="post-title">{post.title || 'Détail du Post'}</h1>
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
    </div>
  );
};

PostDetail.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PostDetail;