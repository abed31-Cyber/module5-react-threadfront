import React, { useState } from 'react';
import { createPost } from '../../api/posts';
import './post.css';

const CreatePost = ({ onPostCreated }) => {
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

        try {
            const newPost = await createPost({ content });
            setSuccess('Post créé avec succès!');
            setContent('');

            if (onPostCreated) {
                onPostCreated(newPost);
            }
        } catch (error) {
            setError('Erreur lors de la création du post');
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentTime = new Date().toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'long',
        year: '2-digit'
    });

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <h2>New Post</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tapez votre post ici ..."
                        disabled={loading}
                        className="content-textarea"
                        rows="6"
                    />
                </div>

                <div className="timestamp">{currentTime}</div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'En cours...' : 'Poster !'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
