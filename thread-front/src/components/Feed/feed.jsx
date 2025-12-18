import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import { triggerCatErrorEffect } from '../../utils/catEffect';
import { useNavigate } from 'react-router-dom';
import FeedCard from './PostCard.jsx';
import './feed.css';
import AuthContext from '../../../context/AuthContext.jsx';


const Feed = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const observerRef = useRef(null);  
  const loadMoreRef = useRef(null);

  const POSTS_PER_PAGE = 10;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    // Création d'un post optimiste
    const tempId = `temp-${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      content: newPostContent,
      createdAt: new Date().toISOString(),
      User: user ? { username: user.user?.username || user.username } : { username: 'Moi' },
      optimistic: true,
    };
    setPosts((prev) => [optimisticPost, ...prev]);
    setNewPostContent('');

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: optimisticPost.content }),
      });

      if (!response.ok) {
        // Suppression du post optimiste en cas d'échec
        setPosts((prev) => prev.filter((p) => p.id !== tempId));
        toast.error('😿 Impossible de créer le post.');
        triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
        throw new Error('Failed to create post');
      }

      const realPost = await response.json();
      setPosts((prev) => [realPost, ...prev.filter((p) => p.id !== tempId)]);
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
      setError(err.message || 'Could not submit post.');
      toast.error('😿 Impossible de créer le post.');
      triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      console.log(' Chargement des posts, page:', page, 'API URL:', API_BASE_URL);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        console.log(' Réponse API posts:', response.status, response.ok);

        if (!response.ok) {
          console.error(' Erreur API posts:', response.status, response.statusText);
          toast.error('😿 Impossible de charger les posts.');
          triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Vérifier le contenu avant de parser
        const responseText = await response.text();
        console.log(' Contenu brut de la réponse:', responseText);
        
        const data = JSON.parse(responseText);
        console.log(' Posts reçus:', data.length, data);
        
        if (data.length === 0 || data.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }

        setPosts((prevPosts) => {
          const newPosts = data.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          );
          const result = page === 1 ? newPosts : [...prevPosts, ...newPosts];
          console.log(' Posts finaux à afficher:', result.length);
          return result;
        });
      } catch (err) {
          console.error(' Error:', err);
          setError(err.message || 'Une erreur est survenue.');
          toast.error('😿 Impossible de charger les posts.');
          triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page, API_BASE_URL, POSTS_PER_PAGE]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const options = {
      root: null,
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasMore, loading]);

  const handleRetry = () => {
    setPosts([]);
    setHasMore(true);
    setError(null);
    setPage(1);
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1> Feed</h1>
        {user && (
          <form onSubmit={handlePostSubmit} className="post-form">
            <textarea 
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
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
            Réessayer
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
          <FeedCard 
            key={post.id}
            post={post} 
            onClick={() => !post.optimistic && navigate(`/posts/${post.id}`)}
            style={{ cursor: post.optimistic ? 'wait' : 'pointer', opacity: post.optimistic ? 0.6 : 1 }}
            optimistic={post.optimistic}
          />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement des posts...</p>
        </div>
      )}

      {!loading && hasMore && posts.length > 0 && (
        <div ref={loadMoreRef} className="load-more-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="no-more-posts">
           Vous avez vu tous les posts.
        </div>
      )}

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

export default Feed;