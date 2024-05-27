import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import MangaList from "./MangaList";

const Biblio = () => {
  const [title, setTitle] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !bookNumber || !image) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("booknumber", bookNumber);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        "http://localhost:3001/Biblio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Réponse du serveur:", response.data);

      setTitle("");
      setBookNumber("");
      setImage(null);
      setError("");
    } catch (error) {
      console.error("Erreur lors de la requête POST:", error);
      setError(
        "Une erreur s'est produite lors de l'ajout du manga. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card
            border="primary"
            style={{ backgroundColor: "#1a1a1a", color: "white" }}
            className="p-4"
          >
            <h2 className="mb-4">Ajouter un nouveau manga</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez le titre du manga"
                />
              </Form.Group>
              <Form.Group controlId="bookNumber">
                <Form.Label>Numéro du livre</Form.Label>
                <Form.Control
                  type="text"
                  value={bookNumber}
                  onChange={(e) => setBookNumber(e.target.value)}
                  placeholder="Entrez le numéro du livre"
                />
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  className="mb-3"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="mr-2"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Ajouter"
                )}
              </Button>
              {loading && <Spinner animation="border" size="sm" />}
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Card>
        </div>
      </div>
      {/* Ajout de la liste des mangas */}
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <MangaList />
        </div>
      </div>
    </div>
  );
};

export default Biblio;
