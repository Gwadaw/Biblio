import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";

const MangaLibrary = () => {
  const [mangas, setMangas] = useState([]);
  const [title, setTitle] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [image, setImage] = useState(null); // Ajout du state pour l'image
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await axios.get("http://localhost:3001/biblio");
        setMangas(response.data);
      } catch (error) {
        console.error("Error fetching mangas:", error);
      }
    };

    fetchMangas();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Met à jour le state avec le fichier image sélectionné
  };

  const handleAddManga = async () => {
    if (!title || !bookNumber || !image) { // Vérifie si le titre, le numéro de livre et l'image sont renseignés
      setError("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("bookNumber", bookNumber);
    formData.append("image", image); // Ajoute l'image au FormData

    try {
      const response = await axios.post("http://localhost:3001/biblio", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMangas([...mangas, response.data.manga]);
      setTitle("");
      setBookNumber("");
      setImage(null); // Réinitialise l'état de l'image
      setError("");
    } catch (error) {
      console.error("Error adding manga:", error);
      setError("Une erreur s'est produite lors de l'ajout du manga. Veuillez réessayer.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Bibliothèque de Manga</h2>
      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h3 className="mb-3">Ajouter un nouveau manga</h3>
              <Form>
                <Form.Group controlId="title">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="bookNumber">
                  <Form.Label>Numéro du livre</Form.Label>
                  <Form.Control type="text" placeholder="Numéro du livre" value={bookNumber} onChange={(e) => setBookNumber(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="image"> {/* Champ pour sélectionner une image */}
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" onClick={handleAddManga}>Ajouter</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        {mangas.map((manga, index) => (
          <Col xs={12} md={4} key={index}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{manga.title}</Card.Title>
                <Card.Text>
                  Numéro du livre: {manga.bookNumber}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MangaLibrary;
