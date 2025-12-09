import { useState } from 'react';
import './post.css';

export default function PostCard({ post, onDelete, onUpdate, currentUserId, currentUserRole }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editContent, setEditContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const canEditDelete = currentUserId === post.userId || currentUserRole === 'admin';

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post?')) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                if (onDelete) {
                    onDelete(post.id);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ title: editTitle, content: editContent })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification');
            }

            const updatedPost = await response.json();
            if (onUpdate) {
                onUpdate(updatedPost.post);
            }
            setIsEditing(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-card">
            {error && <div className="error-message">{error}</div>}

            {isEditing ? (
                <form onSubmit={handleUpdate} className="edit-form">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                        disabled={loading}
                    />
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="edit-textarea"
                        disabled={loading}
                        rows="4"
                    />
                    <div className="edit-buttons">
                        <button type="submit" disabled={loading} className="save-btn">
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setEditTitle(post.title);
                                setEditContent(post.content);
                            }}
                            disabled={loading}
                            className="cancel-btn"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="post-header">
                        <h3>{post.title}</h3>
                        {canEditDelete && (
                            <div className="post-actions">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="edit-btn"
                                    disabled={loading}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="delete-btn"
                                    disabled={loading}
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="post-author">
                        Par <strong>{post.User?.username || 'Utilisateur'}</strong>
                    </p>

                    <p className="post-content">{post.content}</p>

                    <div className="post-meta">
                        <span className="comment-count">
                            💬 {post.Comments?.length || 0} commentaires
                        </span>
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
