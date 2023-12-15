const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DataManager = require("./dataManager");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataManager = new DataManager(
  "localhost",
  "biblio_manga",
  "root",
  "biblio"
);

dataManager.Connect();

app.post("/login", (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res
      .status(400)
      .json({ error: "Nickname and password are required." });
  }

  const sql = "SELECT * FROM user WHERE nickname = ? AND password = ?";
  dataManager.query(sql, [nickname, password], (err, data) => {
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

app.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nickname, email, and password are required." });
  }

  const sql = "INSERT INTO user (nickname, email, password) VALUES (?, ?, ?)";
  dataManager.query(sql, [nickname, email, password], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "Signup successful", user: data });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("exit", () => {
  dataManager.Disconnect();
});
