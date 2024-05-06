require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const DataManager = require("./dataManager");
const Joi = require('joi');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const {
  USER,
  PASSWORD,
  BDD,
  HTTP_PORT,
  JWT_SECRET
} = process.env;

const dataManager = new DataManager(
  "localhost",
  USER,
  PASSWORD,
  BDD
);

dataManager.Connect();

// Validation des données avec Joi
const mangaSchema = Joi.object({
  title: Joi.string().required(),
  bookNumber: Joi.number().required(),
  image: Joi.binary().encoding('base64').required()
});

app.post("/login", (req, res) => {
  // Vérification de la présence du nickname et du mot de passe
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).json({ error: "Nickname and password are required." });
  }

  // Requête SQL pour récupérer l'utilisateur par le nickname
  const sql = "SELECT * FROM user WHERE nickname = ?";
  dataManager.query(sql, [nickname], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Vérification du résultat de la requête
    if (data.length === 1) {
      const user = data[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords: " + err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result) {
          // Utilisateur authentifié, génération du token JWT
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
          res.cookie('token', token, { httpOnly: true, secure: true }); 
          return res.json({ message: "Login successful", user, token });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Route de création de compte et vérification des champs
app.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "Nickname, email, and password are required." });
  }

  // Génération d'un sel aléatoire pour le hachage du mot de passe
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Requête SQL pour insérer un nouvel utilisateur
  const sql = "INSERT INTO user (nickname, email, password) VALUES (?, ?, ?)";
  dataManager.query(sql, [nickname, email, hashedPassword], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "Signup successful", user: data });
  });
});

// Route pour ajouter un manga dans la bibliothèque
app.post("/MangaLibrary", (req, res) => {
  console.log("Request body:", req.body);
  const { error, value } = mangaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, bookNumber, image } = value;

  // Requête SQL pour insérer un nouveau manga
  const sql = "INSERT INTO manga (title, booknumber, image, user_id) VALUES (?, ?, ?, ?)";
  const userId = req.body.userId;
  dataManager.query(sql, [title, bookNumber, image, userId], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "A new manga added to the library", manga: data });
  });
});

// Route pour récupérer tous les mangas de la bibliothèque
app.get("/MangaLibrary",(req, res) => {
  // Requête SQL pour sélectionner tous les mangas
  const sql = "SELECT * FROM manga";
  dataManager.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Renvoyer les données des mangas en réponse
    return res.json(data);
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = HTTP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("exit", () => {
  dataManager.Disconnect();
});
