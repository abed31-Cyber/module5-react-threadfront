import React from 'react';
import PropTypes from 'prop-types';

const FeedCard = ({ post, onClick, style, optimistic }) => {
  // Format date: HH:MM - DD Month YY (comme dans l'image)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Format time: HH:MM (sans secondes)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Format date: DD Month YY
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2); // Seulement les 2 derniers chiffres
    const formattedDate = `${day} ${month} ${year}`;
    
    return `${timeString} - ${formattedDate}`;
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

  return (
    <div className="post-card" onClick={onClick} style={style}>
      <div className="post-header">
        <div className="post-avatar">
          {getInitials(author)}
        </div>
        <div className="post-author-info">
          {/* Author removed from header - will be displayed with content */}
        </div>
      </div>
      
      <div className="post-content">
        <strong className="post-author">@{author}</strong>
        <p>{content}</p>
      </div>
      
      <div className="post-footer">
        <span className="post-date">{formatDate(createdAt)}</span>
        {optimistic && (
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Envoi...</div>
        )}
      </div>
    </div>
  );
};

FeedCard.propTypes = {
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
  onClick: PropTypes.func,
  style: PropTypes.object,
  optimistic: PropTypes.bool,
};

export default FeedCard;