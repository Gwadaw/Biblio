import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import './login.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Login = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirection, setRedirection] = useState(false);
  const navigate = useNavigate();

  const requetePost = async () => {
    try {
      const response = await axios.post("http://localhost:3001/someEndpoint", {
        nickname,
        email,
        password,
      });
      console.log(response.data);
      setRedirection(true);
    } catch (error) {
      console.error("Erreur lors de la requête POST", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        nickname,
        email,
        password,
      });

      console.log(response.data);

      requetePost();
    } catch (err) {
      console.error(err);
      setError("Les informations d'identification sont invalides");
    }
  };

  if (redirection) {
    navigate("/App");
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        {" "}
        <Col xs={6}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>{" "}
      </Row>
    </Container>
  );
};

export default Login;
