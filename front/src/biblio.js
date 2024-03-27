import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Biblio = () => {
  const [title, setTitle] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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

      const response = await axios.post("http://localhost:3001/biblio", formData, {
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
    <div>
      <h2>Ajouter un nouveau manga</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Titre</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="bookNumber">
          <Form.Label>Numéro du livre</Form.Label>
          <Form.Control
            type="text"
            value={bookNumber}
            onChange={(e) => setBookNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Ajouter
        </Button>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Biblio;
