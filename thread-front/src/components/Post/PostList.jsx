import React, { useEffect, useState } from 'react';
import { fetchPosts, deletePost } from '../../api/posts';
import PostCard from './PostCard';
import './post.css';

export default function PostList({ currentUserId, currentUserRole, refreshTrigger }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/posts');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des posts');
            }
            const data = await response.json();
            setPosts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [refreshTrigger]);

    const handlePostDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts(posts.filter((post) => post.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
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
