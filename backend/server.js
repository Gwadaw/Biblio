const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const DataManager = require("./dataManager");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataManager = new DataManager(
  "localhost",
  "root",
  "solene1209?",
  "biblio"
);

dataManager.Connect();

// Route de connexion
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
      // Comparaison des mots de passe hachés
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords: " + err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result) {
          // Utilisateur authentifié, génération du token JWT
          const token = jwt.sign({ userId: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
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

// Route de création de compte
app.post("/signup", (req, res) => {
  // Vérification de la présence du nickname, de l'email et du mot de passe
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "Nickname, email, and password are required." });
  }

  // Hachage du mot de passe
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

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
});

// Route pour ajouter un manga dans la bibliothèque
app.post("/biblio", (req, res) => {
  // Vérification de la présence du titre, de l'image et du numéro du livre
  const { title, image, booknumber } = req.body;
  if (!title || !image || !booknumber) {
    return res.status(400).json({ error: "Title, image, and booknumber are required." });
  }

  // Requête SQL pour ajouter un nouveau manga
  const sql = "INSERT INTO manga (title, image, booknumber) VALUES (?, ?, ?)";
  dataManager.query(sql, [title, image, booknumber], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "A new manga added to the library", manga: data });
  });
});

// Route pour récupérer tous les mangas de la bibliothèque
app.get("/biblio", (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("exit", () => {
  dataManager.Disconnect();
});
