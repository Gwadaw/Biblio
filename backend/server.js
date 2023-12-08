const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const DataManager = require("./dataManager");

const app = express();
app.use(bodyParser.json());

const dataManager = new DataManager(
  "localhost",
  "biblio_manga",
  "root",
  "biblio"
);
dataManager.Connect();

app.get("/", (req, res) => {
  return res.json("On est bien sur le serveur ici !");
});

app.post("/login", (req, res) => {
  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res
      .status(400)
      .json({ error: "nickname, email and password are required." });
  }

  const sql =
    "SELECT * FROM user WHERE nickname = ? AND email = ? AND password = ?";
  dataManager.query(sql, [nickname, email, password], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length === 1) {
      return res.json({ message: "Login successful", user: data[0] });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
