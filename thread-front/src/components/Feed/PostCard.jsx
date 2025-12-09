import React from 'react';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}min`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}j`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  // Get initials from author name
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Adapter les données de l'API au format attendu
  const author = post.User?.username || post.author || 'Anonyme';
  const content = post.content;
  const createdAt = post.createdAt;
  const likes = post.likes || 0;
  const comments = post.Comments?.length || post.comments || 0;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {getInitials(author)}
        </div>
        <div className="post-author-info">
          <h3 className="post-author">{author}</h3>
          <span className="post-date">{formatDate(createdAt)}</span>
        </div>
      </div>
      
      <div className="post-content">
        {content}
      </div>
      
      <div className="post-stats">
        <div className="post-stat">
          <span className="post-stat-label">Commentaires:</span>
          <span>{comments}</span>
        </div>
        <div className="post-stat">
          <span className="post-stat-label">Likes:</span>
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    User: PropTypes.shape({
      username: PropTypes.string,
    }),
    author: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likes: PropTypes.number,
    Comments: PropTypes.array,
    comments: PropTypes.number,
  }).isRequired,
};

export default PostCard;
