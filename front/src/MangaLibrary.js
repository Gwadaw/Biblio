import React, { useState, useEffect } from "react";
import axios from "axios";

const MangaLibrary = () => {
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Récupérer les données des mangas depuis le serveur lors du montage du composant
    axios.get("http://localhost:3001/MangaLibrary")
      .then(response => {
        setMangas(response.data);
      })
      .catch(error => {
        setError("Une erreur s'est produite lors de la récupération des mangas.");
      });
  }, []);

  return (
    <div>
      <h2>Ma Bibliothèque de Mangas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {mangas.map(manga => (
          <li key={manga.id}>
            {manga.title} - Numéro {manga.bookNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MangaLibrary;
