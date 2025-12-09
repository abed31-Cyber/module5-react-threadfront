
import React, { useState, useEffect, useContext } from 'react';
import PostCard from './PostCard.jsx';
import './feed.css';
import AuthContext from '../../../context/AuthContext.jsx';

// Composant Feed pour afficher le fil d'actualité
const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    // appel de l'API pour récupérer les posts 
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue, Mimine est passée par là ! Fuyez');
      console.error('Erreur lors du fetch, Mimine n\'est pas loin:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect pour charger les posts au montage du composant
  useEffect(() => {
    fetchPosts();
  }, []);
  // Gestion de la tentative de rechargement en cas d'erreur
  const handleRetry = () => {
    setPosts([]);
    setError(null);
    fetchPosts();
  };
  // Rendu du composant Feed pour afficher les posts, le formulaire de création de post, et les messages d'erreur ou de chargement
  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1> Feed</h1>
        {user && (
          <form className="post-form">
            <textarea placeholder="Ici integrer les posts?"></textarea>
            <button type="submit">Post</button>
          </form>
        )}
      </div>

      {error && (
        <div className="error-container">
          <div className="error-message">
            {error}
          </div>
          <button onClick={handleRetry} className="retry-button">
            Réessayer, Mimine y croit !
          </button>
        </div>
      )}

      {posts.length === 0 && !loading && !error && (
        <div className="empty-feed">
          <div className="empty-feed-icon"></div>
          <p className="empty-feed-text">Aucun post à afficher</p>
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement des posts...</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
