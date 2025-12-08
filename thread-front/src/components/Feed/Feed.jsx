import React, { useState, useEffect, useCallback, useRef } from 'react';
import PostCard from './PostCard';
import '..feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);  
  const loadMoreRef = useRef(null);

  const POSTS_PER_PAGE = 10;
  const API_BASE_URL = 'http://localhost:3000';

  // Fetch posts from API
  const fetchPosts = useCallback(async (pageNum) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0 || data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      setPosts((prevPosts) => {
        // Avoid duplicates
        const newPosts = data.filter(
          (newPost) => !prevPosts.some((post) => post.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue, Mimine est passée par là ! Fuyez');
      console.error('Erreur lors du fetch, Mimine n\'est pas loin:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const options = {
      root: null,
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !loading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchPosts(nextPage);
          return nextPage;
        });
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
  }, [hasMore, loading, fetchPosts]);

  // Retry on error
  const handleRetry = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchPosts(1);
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1> Feed</h1>
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

      {!loading && hasMore && posts.length > 0 && (
        <div ref={loadMoreRef} className="load-more-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="no-more-posts">
           Vous avez vu tous les posts que Mimine a
        </div>
      )}
    </div>
  );
};

export default Feed;
