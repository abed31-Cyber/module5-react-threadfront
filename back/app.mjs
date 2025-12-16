import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// chargement des variables d'environnement
dotenv.config();
// je definis la clé secrète pour le JWT
const secretKeyJWT = process.env.JWT_SECRET;
// je crée un middleware pour authentifier les requêtes
function authenticate(req, res, next) {
    // je récupère le token JWT depuis les cookies
    const token = req.cookies.jwt;
    // si pas de token, on renvoie une erreur 401
    if (!token)
        return res.status(401).json({ message: " non authentifié" });
    try {
        // je vérifie le token et je décode les informations utilisateur
        const decoded = jwt.verify(token, secretKeyJWT);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token non valide" })
    }
}

// ma fonction principale pour démarrer le serveur qui va charger Sequelize et définir les routes
async function main() {
    try {
        // je charge Sequelize et mes modèles
        const { sequelize, models } = await loadSequelize();
        // je synchronise la base de données (création des tables si elles n'existent pas)
        const { User, Post, Comment } = models;
        // je démarre la synchronisation de la base de données
        await sequelize.sync();
        // je crée une instance d'Express pour mon serveur HTTP  
        const app = express();
        // ici le middleware pour parser le JSON, les cookies et gérer le CORS
        app.use(express.json());
        app.use(cookieParser());
        app.use(cors({
            origin: true,
            credentials: true
        }));

        // ------------REGISTER-------------
        // route pour l'inscription d'un nouvel utilisateur
        app.post("/register", async (req, res) => {
            try {
                // Récupère username, email et password de la requête utilisateur
                const { username, email, password, role } = req.body;

                // Vérifie si l'utilisateur existe déjà
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(409).json({ message: "Email déjà utilisé" });
                }



                // Création du user/useradmin
                const user = await User.create({
                    "username": req.body.username,
                    "email": req.body.email,
                    "password": req.body.password,
                    "role": req.body.role
                });

                // Génération du JWT
                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    secretKeyJWT,
                    { expiresIn: "7d" }
                );

                // Envoi du token dans un cookie httpOnly et sameSite lax
                res.cookie("jwt", token, {
                    httpOnly: true,
                    sameSite: "lax"
                });
                // Réponse avec les informations de l'utilisateur (sans le mot de passe)
                res.status(201).json({ message: "Compte créé", user: { id: user.id, username: user.username, email: user.email } });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });

        //---------------LOGIN--------------

        // route pour la connexion d'un utilisateur existant
        app.post("/login", async (req, res) => {
            try {
                // Récupère email et password de la requête utilisateur
                // const { email, password } = req.body;
                const password = req.body.password;
                const email = req.body.email;
                // on cherche l'utilisateur dans la bdd
                const user = await User.findOne({ where: { email } });
                if (!user) return res.status(400).json({ message: "Email incorrect" });
                // on compare le password avec le hash en bdd
                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return res.status(400).json({ message: "Mot de passe incorrect" });
                // si tout est ok, on génère un token JWT avec les infos utilisateur
                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    secretKeyJWT,
                    { expiresIn: "1h" }
                );
                // on envoie le token dans un cookie hhttpOnly et sameSite lax(protection en plus)
                res.cookie("jwt", token, {
                    httpOnly: true,
                    sameSite: "lax"
                });
                // on renvoie une réponse avec les infos utilisateur (sans le mot de passe)
                res.json({ message: "Connecté", user: { id: user.id, username: user.username, email: user.email } });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });
        // ---------GET ME (récupérer utilisateur connecté)----------
        // route pour récupérer les informations de l'utilisateur connecté
        app.get('/me', authenticate, (req, res) => {
          // Le middleware 'authenticate' a déjà vérifié le token
          // et a placé les informations de l'utilisateur dans req.user.
          res.json(req.user);
        });


        // ----------LOGOUT----------------
        // route pour la déconnexion de l'utilisateur
        app.post("/logout", (req, res) => {
            res.clearCookie("jwt");
            res.json({ message: "Déconnecté" });
        });

        //------création d'un post------------
        // route pour créer un nouveau post (authentifiée) on ajoute le middleware authenticate
        app.post("/posts", authenticate, async (req, res) => {
            try {
                if (!req.body || !req.body.content) {
                    return res.status(400).json({ message: "Pour créer un post, un contenu est requis" });
                }
                // on crée le post avec le userId de l'utilisateur authentifié
                const post = await Post.create({
                    "content": req.body.content,
                    "userId" : req.user.id
                });
                return res.status(201).json({ error: "Post créé avec succès", post });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erreur serveur" });
            }
        });


        //----Récuperation de tous les posts avec commentaire

        app.get("/posts", async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const offset = (page - 1) * limit;

                const posts = await Post.findAll({
                    include: [{ 
                        association: "User",
                        attributes: ["id", "username"]
                    }, {
                        association: "Comments",
                        include: [{
                            association: "User",
                            attributes: ["id", "username"]
                        }]
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: limit,
                    offset: offset
                });

                return res.status(200).json(posts);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });

        // ----Récupération d'un post par ID

        app.get("/posts/:postId", async (req, res) => {
            try {
                // on récupère le post avec les commentaires associés avec la fonction findByPk et les associations 
                const post = await Post.findByPk(req.params.postId, {
                    include: [{
                        association: "User",
                        attributes: ["id", "username"]
                    }, {
                        association: "Comments",
                        include: [{
                            association: "User",
                            attributes: ["id", "username"]
                        }]
                    }]
                });
                if (!post) {
                    return res.status(404).json({ message: "Post non trouvé" });
                }
                res.status(200).json(post);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" });
                return res.status(500).json({ comment: "Erreur serveur" });
            }
        });

        //----Création d'un commentaire pour un post
        app.post("/posts/:postId/comments", authenticate, async (req, res) => {
            const { postId } = req.params;
            const { content } = req.body;

            try {
                // On suppose que l'utilisateur est authentifié (cookie JWT)
                let userId = null;
                if (req.cookies && req.cookies.jwt) {
                    try {
                        const decoded = jwt.verify(req.cookies.jwt, secretKeyJWT);
                        userId = decoded.id;
                    } catch (e) {}
                }
                // Vérification que l'utilisateur existe bien
                if (userId) {
                    const user = await User.findByPk(userId);
                    if (!user) {
                        return res.status(401).json({ message: "Utilisateur non trouvé. Veuillez vous reconnecter." });
                    }
                }
                // Si pas d'userId, on laisse Sequelize gérer (pour compatibilité)
                const comment = await Comment.create(userId ? { content, postId, userId } : { content, postId });
                // On recharge le commentaire avec l'utilisateur associé pour le front
                const commentWithUser = await Comment.findByPk(comment.id, {
                    include: [{
                        association: "User",
                        attributes: ["id", "username"]
                    }]
                });
                res.status(201).json(commentWithUser);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });

        // ---suppresion d'un post------
        // route pour supprimer un post par ID (authentifiée)
        app.delete("/posts/:postId", authenticate, async (req, res) => {
            try {
                // je recupère le post à supprimer depuis les paramètres de la requête
                const post = await Post.findByPk(req.params.postId);
                if (!post) {
                    return res.status(404).json({ message: "Post non trouvé" });
                }
                // si l'utilisateur n'est pas le créateur du post et n'est pas admin, on refuse l'accès
                if (post.userId !== req.user.id && req.user.role !== "admin") {
                    return res.status(403).json({ message: "Accès refusé" });
                }
                // suppression du post
                await post.destroy();
                res.status(200).json({ message: "Post supprimé avec succès" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });

        // ----Modification d'un post------
        // route pour modifier un post par ID (authentifiée) avec le middleware authenticate
        app.put("/posts/:postId", authenticate, async (req, res) => {
            try {
                // je récupère le post à modifier depuis les paramètres de la requête
                const post = await Post.findByPk(req.params.postId);
                if (!post) {
                    return res.status(404).json({ message: "Post non trouvé" });
                }
                // Vérifier que l'utilisateur est le créateur ou admin
                if (post.userId !== req.user.id && req.user.role !== "admin") {
                    return res.status(403).json({ message: "Accès refusé" });
                }
                // Mettre à jour le contenu
                if (req.body.content) post.content = req.body.content;
                await post.save();
                res.status(200).json({ message: "Post modifié avec succès", post });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });


        // ----suppression d'un commentaire
        // route pour supprimer un commentaire par ID (authentifiée) avec le middleware authenticate
        app.delete("/comments/:commentId", authenticate, async (req, res) => {

            try {

                //  on récupère le commentaire à supprimer depuis les paramètres de la requête

                const comment = await Comment.findByPk(req.params.commentId);
                if (!comment) {
                    return res.status().json({ message: "Commentaire non trouvée " })
                } else {
                    //si le user n'est pas le crateur du comment et n'est pas le admin, erreur accées refusé
                    if (comment.userId !== req.user.id && req.user.role !== "admin") {
                        return res.status(404).json({ massage: "Accées non autorisé" })
                    }
                    await comment.destroy();
                    res.status(200).json({ message: "commentaire supprimée avec succées" })
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur" })
            }

        })

        // récuperer les posts d'un utilisateur

        app.get("/users/:userId/posts", async (req, res) => {
            try {
                const posts = await Post.findAll({ 
                    where: { userId: req.params.userId },
                    include: [{ 
                        association: "User",
                        attributes: ["id", "username"]
                    }, {
                        association: "Comments",
                        include: [{
                            association: "User",
                            attributes: ["id", "username"]
                        }]
                    }],
                    order: [['createdAt', 'DESC']]
                });
                res.status(200).json(posts);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur lors de la récupération des posts" });
            }
        })

        // Start serveur
        // je démarre le serveur sur le port défini dans les variables d'environnement ou 3000 par défaut

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Serveur démarré sur http://localhost:${process.env.PORT || 3000}`);
        });

    } catch (error) {
        console.error("Erreur de chargement Sequelize:", error);
    }
}
// j'appelle ma fonction principale pour démarrer le serveur
main();
