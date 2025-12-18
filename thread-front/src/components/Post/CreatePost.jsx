import React, { useState, useEffect } from 'react';
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
    const [currentTime, setCurrentTime] = useState('');

    // Mettre à jour l'heure en temps réel
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            const month = months[now.getMonth()];
            const year = String(now.getFullYear()).slice(-2);
            setCurrentTime(`${hours}:${minutes} - ${day} ${month} ${year}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!content.trim()) {
            setError('Le contenu est obligatoire');
            return;
        }

        setLoading(true);

        try {
            const newPost = await createPost({ content });
            setSuccess('Post créé avec succès!');
            setContent('');
            if (onPostCreated) {
                onPostCreated(newPost);
            }
            setTimeout(() => {
                navigate('/feed');
            }, 1000);
        } catch (error) {
            if (error?.response?.status === 401) {
                toast.error("😾 Mrrrow ! Tu n'es pas autorisé à poster ici.");
                triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3");
            } else if (error?.response?.status === 403) {
                toast.error("😼 Grrr ! Tu n'as pas le droit de créer ce post.");
                triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3");
            } else if (error?.response?.status === 404) {
                toast.error('🐾 Miaou ? Impossible de trouver la ressource !');
                triggerCatErrorEffect("ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3");
            } else {
                toast.error('😿 Impossible de créer le post.');
                triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
            }
            setError('Erreur lors de la création du post');
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-container">
            {/* EN-TÊTE AVEC ICÔNE */}
            <div className="create-post-header">
            
                <h1>New Post</h1>
            </div>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="create-post-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {/* TEXTAREA */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tapez votre post ici ..."
                    disabled={loading}
                    className="content-textarea"
                    rows="8"
                />

                {/* TIMESTAMP */}
                <div className="post-timestamp">{currentTime}</div>

                {/* BOUTON POSTER */}
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'En cours...' : 'Poster !'}
                </button>
            </form>

            {/* NAVIGATION BOTTOM */}
            <div className="bottom-navigation">
                <button 
                    className="nav-button" 
                    onClick={() => navigate('/feed')}
                    aria-label="Retour au feed"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                </button>
                <button 
                    className="nav-button" 
                    onClick={() => navigate('/profile')}
                    aria-label="Profil"
                    type="button"
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

export default CreatePost;