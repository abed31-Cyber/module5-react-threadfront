import React, { useEffect, useState, useContext } from "react";
import { triggerCatErrorEffect } from "../../utils/catEffect";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import "./post.css";
import AuthContext from "../../../context/AuthContext";

const PostDetail = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("😾 Mrrrow ! Tu n’est pas autorisé à voir ce post.");
            triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3");
          } else if (response.status === 403) {
            toast.error("😼 Grrr ! Ce post est protégé, pas touche !");
            triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3");
          } else if (response.status === 404) {
            toast.error(
              "🐾 Miaou ? Ce post est introuvable, cherche ailleurs !"
            );
            triggerCatErrorEffect(
              "ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"
            );
          } else {
            toast.error("😿 Impossible de récupérer ce post.");
            triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
          }
          throw new Error("Erreur lors de la récupération du post");
        }
        const data = await response.json();
        console.log("API response:", data);
        setPost(data); // L'API renvoie directement l'objet post, pas data.post
      } catch (err) {
        console.error("Erreur lors de la récupération:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div>Aucun détail disponible pour ce post.</div>;
  }

  // ...existing code...

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");
    if (!commentContent.trim()) {
      setCommentError("Le commentaire ne peut pas être vide.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:3000/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: commentContent }),
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("😾 Mrrrow ! Tu n’est pas autorisé à miauler ici.");
          triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3");
        } else if (res.status === 403) {
          toast.error("😼 Grrr ! Tu n’as pas le droit de commenter ce post.");
          triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3");
        } else if (res.status === 404) {
          toast.error("🐾 Miaou ? Ce post n’existe plus, va voir ailleurs !");
          triggerCatErrorEffect(
            "ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"
          );
        } else {
          toast.error("😿 Impossible d’ajouter ton commentaire.");
          triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
        }
        throw new Error("Erreur lors de l'ajout du commentaire");
      }
      setCommentSuccess("Commentaire ajouté !");
      setCommentContent("");
      // Rafraîchir les commentaires
      const updated = await res.json();
      setPost((prev) => ({
        ...prev,
        Comments: [...(prev.Comments || []), updated],
      }));
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Vérifier si l'utilisateur peut supprimer le post
  const canDeletePost =
    isAuthenticated &&
    (user?.user?.id === post.User?.id ||
      user?.user?.role === "admin" ||
      user?.role === "admin");

  const handleDeletePost = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("😾 Mrrrow ! Tu n’as pas le droit de supprimer ce post.");
          triggerCatErrorEffect("ANMLCat_Chat qui rale (ID 0658)_LS.mp3");
        } else if (res.status === 403) {
          toast.error("😼 Grrr ! Ce post est protégé, pas touche !");
          triggerCatErrorEffect("ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3");
        } else if (res.status === 404) {
          toast.error("🐾 Miaou ? Ce post a disparu, introuvable !");
          triggerCatErrorEffect(
            "ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"
          );
        } else {
          toast.error("😿 Impossible de supprimer ce post.");
          triggerCatErrorEffect("ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3");
        }
        throw new Error("Erreur lors de la suppression du post");
      }
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="post-detail">
      <div className="post-title">
        <h1>|Post</h1>
      </div>
      <div className="post-content">
        <span className="post-author">{post.User?.username || "Anonyme"}</span>
        <p>{post.content}</p>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          - {new Date(post.createdAt).toLocaleDateString("fr-FR")}
        </span>
        {canDeletePost && (
          <button onClick={handleDeletePost} className="delete-btn">
            Supprimer le post
          </button>
        )}
      </div>
      <section className="post-comments">
        <div
          className="comments-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "24px 0 16px 0",
          }}
        >
          <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {post.Comments ? post.Comments.length : 0}
          </span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ verticalAlign: "middle" }}
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {post.Comments && post.Comments.length > 0 ? (
          <ul>
            {post.Comments.map((comment) => {
              const canDeleteComment =
                isAuthenticated &&
                (user?.user?.id === comment.User?.id ||
                  user?.user?.role === "admin" ||
                  user?.role === "admin");
              const handleDeleteComment = async () => {
                if (!window.confirm("Supprimer ce commentaire ?")) return;
                try {
                  const res = await fetch(
                    `http://localhost:3000/comments/${comment.id}`,
                    {
                      method: "DELETE",
                      credentials: "include",
                    }
                  );
                  if (!res.ok) {
                    if (res.status === 401) {
                      toast.error(
                        "😾 Mrrrow ! Tu n’as pas le droit de supprimer ce commentaire."
                      );
                      triggerCatErrorEffect(
                        "ANMLCat_Chat qui rale (ID 0658)_LS.mp3"
                      );
                    } else if (res.status === 403) {
                      toast.error(
                        "😼 Grrr ! Ce commentaire est protégé, pas touche !"
                      );
                      triggerCatErrorEffect(
                        "ANMLCat_Grognement chat 3 (ID 1887)_LS.mp3"
                      );
                    } else if (res.status === 404) {
                      toast.error(
                        "🐾 Miaou ? Ce commentaire a disparu, introuvable !"
                      );
                      triggerCatErrorEffect(
                        "ANMLCat_Deux chats qui se battent (ID 0817)_LS.mp3"
                      );
                    } else {
                      toast.error("😿 Impossible de supprimer ce commentaire.");
                      triggerCatErrorEffect(
                        "ANMLCat_Miaulement chat 2 (ID 1890)_LS.mp3"
                      );
                    }
                    throw new Error(
                      "Erreur lors de la suppression du commentaire"
                    );
                  }
                  setPost((prev) => ({
                    ...prev,
                    Comments: prev.Comments.filter((c) => c.id !== comment.id),
                  }));
                } catch (err) {
                  alert(err.message);
                }
              };
              return (
                <li
                  key={comment.id}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <p>
                    <strong>@{comment.User?.username || "Anonyme"}</strong>{" "}
                    {comment.content}
                  </p>
                  {canDeleteComment && (
                    <button
                      onClick={handleDeleteComment}
                      className="delete-btn"
                    >
                      Supprimer
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucun commentaire pour ce post.</p>
        )}
        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="comment-form-section">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Votre commentaire..."
              rows={3}
              className="comment-textarea"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="comment-submit-btn"
            >
              {submitting ? "Envoi..." : "Commenter"}
            </button>
            {commentError && (
              <div className="error-message comment-error">{commentError}</div>
            )}
            {commentSuccess && (
              <div className="comment-success">{commentSuccess}</div>
            )}
          </form>
        )}
        {!isAuthenticated && (
          <div className="comment-login-info">
            Connectez-vous pour commenter ce post.
          </div>
        )}
      </section>
      {/* Navigation Buttons */}
      <div className="bottom-navigation">
        <button
          className="nav-button create-button"
          onClick={() => navigate("/createpost")}
          aria-label="Créer un post"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          className="nav-button profile-button"
          onClick={() => navigate("/profile")}
          aria-label="Profil"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PostDetail;
