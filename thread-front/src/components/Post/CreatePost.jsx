import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { triggerCatErrorEffect } from '../../utils/catEffect';
import { createPost } from '../../api/posts';
import { useNavigate } from 'react-router-dom';
import './post.css';

const CreatePost = ({ onPostCreated }) => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!content.trim()) {
            setError('Le contenu est obligatoire');
            return;
        }

        setLoading(true);

        // Création optimiste du post (avant confirmation backend)
        const optimisticPost = {
            id: Date.now(), // id temporaire unique
            content,
            createdAt: new Date().toISOString(),
            Comments: [],
            userId: null // ou récupéré du contexte si besoin
        };
        if (onPostCreated) {
            onPostCreated(optimisticPost);
        }

        try {
            const newPost = await createPost({ content });
            setSuccess('Post créé avec succès!');
            setContent('');
            if (onPostCreated) {
                onPostCreated(newPost);
            }
            navigate('/');
        } catch (error) {
            if (error?.response?.status === 401) { toast.error('😾 Mrrrow ! Tu n’est pas autorisé à poster ici.'); triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3"); }
            else if (error?.response?.status === 403) { toast.error('😼 Grrr ! Tu n’as pas le droit de créer ce post.'); triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3"); }
            else if (error?.response?.status === 404) { toast.error('🐾 Miaou ? Impossible de trouver la ressource !'); triggerCatErrorEffect("ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"); }
            else { toast.error('😿 Impossible de créer le post.'); triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3"); }
            setError('Erreur lors de la création du post');
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    // Ancienne version : pas de timestamp, structure simple

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <h1>|New Post</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tapez votre post ici ..."
                    disabled={loading}
                    className="content-textarea"
                    rows="6"
                />
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'En cours...' : 'Poster !'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
