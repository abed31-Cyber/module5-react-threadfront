import React, { useEffect, useState } from 'react';
import { triggerCatErrorEffect } from '../../utils/catEffect';
import { fetchPosts, deletePost } from '../../api/posts';
import FeedCard from './PostCard';
// Harmonisation : FeedCard renommé en PostCard pour cohérence
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
            if (error?.response?.status === 401) { toast.error('😾 Mrrrow ! Tu n’as pas le droit de supprimer ce post.'); triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3"); }
            else if (error?.response?.status === 403) { toast.error('😼 Grrr ! Ce post est protégé, pas touche !'); triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3"); }
            else if (error?.response?.status === 404) { toast.error('🐾 Miaou ? Ce post a disparu, introuvable !'); triggerCatErrorEffect("ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"); }
            else { toast.error('😿 Impossible de supprimer ce post.'); triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3"); }
            setError('Erreur lors de la suppression du post');
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
