import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Biblio = () => {
  const [title, setTitle] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("bookNumber", bookNumber);
    formData.append("image", image); 

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post("http://localhost:3001/MangaLibrary", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data);
      // Rediriger ou afficher un message de succès
    } catch (error) {
      console.error("Error creating manga:", error);
      setError("Une erreur s'est produite lors de l'ajout du manga.");
    }
  };

  return (
    <Container>
      <h2 className="mt-4">Ajouter un nouveau manga</h2>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group controlId="title">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                  />
                </Form.Group>
                <Form.Group controlId="bookNumber">
                  <Form.Label>Numéro du livre</Form.Label>
                  <Form.Control
                    type="text"
                    value={bookNumber}
                    onChange={(e) => setBookNumber(e.target.value)}
                    name="bookNumber" 
                  />
                </Form.Group>
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    name="image"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Ajouter
                </Button>
              </Form>
              {error && <p className="text-danger mt-3">{error}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Biblio;
