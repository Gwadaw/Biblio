import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirection, setRedirection] = useState(false);
  const navigate = useNavigate();

  //   const requetePost = async () => {
  //     try {
  //       const response = await axios.post("http://localhost:3001/signup", {
  //         nickname,
  //         email,
  //         password,
  //       });
  //       console.log(response.data);
  //       setRedirection(true);
  //     } catch (error) {
  //       console.error("Erreur lors de la requête POST", error);
  //       setError("Erreur lors de l'inscription. Veuillez réessayer.");
  //     }
  //   };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        nickname,
        email,
        password,
      });

      console.log(response.data);
      setRedirection(true);
    } catch (err) {
      console.error(err);
      setError("Les informations d'inscription sont invalides");
    }
  };

  if (redirection) {
    navigate("/App");
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={6}>
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="formBasicNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button variant="primary" type="submit">
              S'inscrire
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
