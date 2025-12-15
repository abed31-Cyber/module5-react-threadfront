import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './post.css';
import CommentCard from '../comment/commentCard';

export default function PostCard({ post, onDelete, onUpdate, currentUserId, currentUserRole }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const canEditDelete = currentUserId === post.userId || currentUserRole === 'admin';

    const handleCardClick = (e) => {
        // Empêcher la navigation si on clique sur les boutons d'édition/suppression
        if (e.target.closest('.post-actions') || e.target.closest('.edit-form')) {
            return;
        }
        navigate(`/posts/${post.id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post?')) {
            return (
                <div className="post-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                    {error && <div className="error-message">{error}</div>}
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="edit-form">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="edit-textarea"
                                disabled={loading}
                                rows="4"
                            />
                            <div className="edit-buttons">
                                <button type="submit" disabled={loading} className="save-btn">Enregistrer</button>
                                <button type="button" onClick={() => { setIsEditing(false); setEditContent(post.content); }} disabled={loading} className="cancel-btn">Annuler</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="post-header">
                                <p className="post-author">Auteur ID : <strong>{post.userId}</strong></p>
                                {canEditDelete && (
                                    <div className="post-actions">
                                        <button onClick={() => setIsEditing(true)} className="edit-btn" disabled={loading}>✏️</button>
                                        <button onClick={handleDelete} className="delete-btn" disabled={loading}>🗑️</button>
                                    </div>
                                )}
                            </div>
                            <p className="post-content">{post.content}</p>
                            <div className="post-meta">
                                <span className="comment-count">{Array.isArray(post.Comments) ? post.Comments.length : 0} commentaires</span>
                                <span className="post-date">{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </>
                    )}
                </div>
            );
            if (!response.ok) {
                throw new Error('Erreur lors de la modification');
            }

            const updatedPost = await response.json();
            if (onUpdate) {
                return (
                    <div className="post-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                        {error && <div className="error-message">{error}</div>}

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="edit-form">
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
                                <h2 className="post-title">Post</h2>
                                <div className="post-meta" style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                                    <span className="post-author">@{post.User?.username || 'Anonyme'}</span>
                                    <span className="post-date">{new Date(post.createdAt).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                    {canEditDelete && (
                                        <div className="post-actions">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                                className="edit-btn"
                                                disabled={loading}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                                className="delete-btn"
                                                disabled={loading}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="comments-header" style={{display:'flex',alignItems:'center',gap:8,margin:'16px 0 0 0'}}>
                                    <span style={{fontSize:'1.1rem',fontWeight:600}}>{post.Comments ? post.Comments.length : 0}</span>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}>
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                );
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    

                </>
            )}
        </div>

    );

}
