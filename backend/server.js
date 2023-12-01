const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: localhost,
  user: oui,
  password: oui,
  database: biblio,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    process.exit(1);
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  return res.json("From backend side");
});

app.get("/user", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
