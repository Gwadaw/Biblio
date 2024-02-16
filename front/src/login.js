import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Login = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const [error, setError] = useState("");
  const [redirection, setRedirection] = useState(false);
  const navigate = useNavigate();

  // const requetePost = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:3001/login", {
  //       nickname,
  //       password,
  //     });
  //     console.log(response.data);
  //     setRedirection(true);
  //   } catch (error) {
  //     console.error("Erreur lors de la requête POST", error);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        nickname,
        password,
      });

      console.log(response.data);
      setRedirection(true);
    } catch (err) {
      console.error(err);
      setError("Les informations d'identification sont invalides");
    }
  };

  if (redirection) {
    navigate("/"); //mettre une redirection vers la session
  }

  return (
    <Container className="form">
      <Row className="justify-content-md-center">
        <Col xs={6}>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
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
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
