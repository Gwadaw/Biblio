import React, { useEffect, useState } from "react";
import axios from "axios";

const MangaList = () => {
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get("http://localhost:3001/Biblio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMangas(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des mangas:", error);
        setError("Erreur lors de la récupération des mangas. Veuillez réessayer.");
      }
    };

    fetchMangas();
  }, []);

  return (
    <div>
      <h3>Bibliothèque de Mangas</h3>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {mangas.length === 0 ? (
        <p>Aucun manga disponible.</p>
      ) : (
        <ul>
          {mangas.map((manga, index) => (
            <li key={manga.id || index}>
              <h4>{manga.title}</h4>
              <p>Numéro: {manga.booknumber}</p>
              <img src={`http://localhost:3001/${manga.image}`} alt={manga.title} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MangaList;
