import React, { useEffect, useState } from 'react';
import { fetchPosts, deletePost } from '../../api/posts';
import PostCard from './PostCard';
import './post.css';

export default function PostList({ currentUserId, currentUserRole, refreshTrigger }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPosts();
            setPosts(data);
        } catch (err) {
            setError('Erreur lors de la récupération des posts');
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [refreshTrigger]);

    const handlePostDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts(posts.filter((post) => post.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
            setError('Erreur lors de la suppression du post');
        }
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    if (loading) {
        return <div className="loading">Chargement des posts...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (posts.length === 0) {
        return <div className="no-posts">Aucun post pour le moment</div>;
    }

    return (
        <div className="posts-list">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDelete}
                    onUpdate={handlePostUpdate}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                />
            ))}
        </div>
    );
}
