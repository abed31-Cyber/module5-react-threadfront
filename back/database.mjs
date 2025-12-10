// database.mjs
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { defaultValueSchemable } from "sequelize/lib/utils";


export async function loadSequelize() {

    try {
        // connection  a la bdd
        const sequelize = new Sequelize(process.env.DATABASE_URL);
        // authentification
        await sequelize.authenticate();
        console.log("Connexion à la base OK");

        // les models
        const User = sequelize.define("User", {
            username: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false },
              role: {
                type: DataTypes.STRING,
                defaultValue: "User"
            },
            password: {
                type: DataTypes.STRING, allowNull: false,

                set(clearPassword) {
                    const hashedPassword = bcrypt.hashSync(clearPassword, 10);
                    this.setDataValue('password', hashedPassword);
                }
            }
           
        });

        const Post = sequelize.define("Post", {
            content: { type: DataTypes.STRING, allowNull: false }
        });

        const Comment = sequelize.define("Comment", {
            content: { type: DataTypes.STRING }
        });

        // RELATIONS
        User.hasMany(Post, { foreignKey: "userId" });
        Post.belongsTo(User, { foreignKey: "userId" });

        User.hasMany(Comment, { foreignKey: "userId" });
        Comment.belongsTo(User, { foreignKey: "userId" });

        Post.hasMany(Comment, { foreignKey: "postId" });
        Comment.belongsTo(Post, { foreignKey: "postId" });


        await sequelize.sync( {force: true} );

        // Insérer des données d'exemple
        const userCount = await User.count();
        if (userCount === 0) {
            // Créer des utilisateurs
            const user1 = await User.create({
                username: "MiaouLover",
                email: "miaulover@example.com",
                password: "password123",
                role: "User"
            });

            const user2 = await User.create({
                username: "ChatPassion",
                email: "chatpassion@example.com",
                password: "password456",
                role: "User"
            });

            const admin = await User.create({
                username: "AdminChat",
                email: "admin@example.com",
                password: "adminpass",
                role: "admin"
            });

            // Créer des posts de chats
            await Post.create({
             
                content: "Voici mon adorable chat gris qui adore se prélasser au soleil. Il s'appelle Gris et il a 3 ans. Il aime particulièrement les souris jouets et les caresses!",
                userId: user1.id
            });

            await Post.create({
           
                content: "Quelle joie! Ma chatte a donné naissance à 5 adorables chatons hier. Ils sont tellement mignons avec leurs petites pattes. Je suis tellement fière d'elle!",
                userId: user2.id
            });

            await Post.create({
           
                content: "Mon chat orange Simba est de retour de ses aventures dans le quartier. Il a renversé le vase, détruit le canapé, et encore il me regarde comme si de rien n'était!",
                userId: user1.id
            });

            await Post.create({
          
                content: "Après 5 ans avec des chats, j'ai découvert les secrets pour les garder heureux: les jouets interactifs, les griffoirs, et surtout beaucoup de caresses!",
                userId: user2.id
            });

            await Post.create({
       
                content: "Beaucoup disent que les chats noirs portent malheur. Moi je dis que c'est du n'importe quoi! Mon chat noir Salem est le plus gentil et affectueux du monde!",
                userId: admin.id
            });

            await Post.create({
            
                content: "Le toilettage est important pour la santé de votre chat. Voici quelques conseils: utiliser une brosse douce, être délicat autour des oreilles, et récompenser avec des friandises!",
                userId: admin.id
            });

            console.log("Données d'exemple insérées avec succès!");
        }

        return { sequelize, models: { User, Post, Comment } };

    } catch (error) {
        console.error(error);
        throw new Error("Impossible de se connecter à la base de données");
    }
}
