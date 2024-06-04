const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const DataManager = require("./dataManager");
const multer = require("multer");
const path = require("path");
require('dotenv').config(); // Charger les variables d'environnement

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataManager = new DataManager(
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME
);

dataManager.Connect();

// Middleware pour servir les images statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurer multer pour gérer les téléchargements d'images
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille du fichier à 10 Mo
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Seules les images sont autorisées."));
    }
    cb(null, true);
  }
});

// Middleware pour vérifier le jeton JWT et définir req.userId
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.userId; // Définir req.userId avec l'ID de l'utilisateur extrait du jeton JWT
    next();
  });
};

app.post("/login", (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).json({ error: "Pseudo et mot de passe requis." });
  }

  const sql = "SELECT * FROM user WHERE nickname = ?";
  dataManager.query(sql, [nickname], (err, data) => {
    if (err) {
      console.error("Erreur lors de la requête de connexion à la base de données : " + err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }

    if (data.length === 1) {
      const user = data[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Erreur lors de la comparaison des mots de passe lors de la connexion : " + err);
          return res.status(500).json({ error: "Erreur interne du serveur" });
        }
        if (result) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.json({ message: "Connexion réussie", user, token });
        } else {
          return res.status(401).json({ error: "Identifiants invalides" });
        }
      });
    } else {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
  });
});

app.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "Pseudo, email et mot de passe requis." });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Erreur lors du hachage du mot de passe lors de l'inscription : " + err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }

    const sql = "INSERT INTO user (nickname, email, password) VALUES (?, ?, ?)";
    dataManager.query(sql, [nickname, email, hashedPassword], (err, data) => {
      if (err) {
        console.error("Erreur lors de la requête d'inscription à la base de données : " + err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }

      return res.json({ message: "Inscription réussie", user: data });
    });
  });
});

app.post("/Biblio", authMiddleware, upload.single("image"), (req, res) => {
  const { title, booknumber } = req.body;
  const image = req.file;
  const userId = req.userId; // Récupérer l'ID de l'utilisateur à partir du jeton JWT

  if (!title || !image || !booknumber) {
    return res.status(400).json({ error: "Titre, image et numéro de livre requis." });
  }

  const sql = "INSERT INTO manga (title, image, booknumber, user_id) VALUES (?, ?, ?, ?)";
  dataManager.query(sql, [title, image.path, booknumber, userId], (err, data) => {
    if (err) {
      console.error("Erreur lors de la requête d'ajout de manga à la base de données :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du manga à la base de données" });
    }

    return res.json({ message: "Un nouveau manga ajouté à la bibliothèque", manga: data });
  });
});

app.get("/Biblio", authMiddleware, (req, res) => {
  const userId = req.userId; // Récupérer l'ID de l'utilisateur à partir du jeton JWT
  const sql = "SELECT title, image, booknumber FROM manga WHERE user_id = ?";
  dataManager.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Erreur lors de la requête de récupération des mangas dans la base de données : " + err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }

    return res.json(data);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

process.on("exit", () => {
  dataManager.Disconnect();
});
