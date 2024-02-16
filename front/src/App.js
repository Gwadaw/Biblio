import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Button from 'react-bootstrap/Button';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <Button variant="primary"><Link to="/">Accueil</Link></Button>{' '}
        <Button variant="secondary"><Link to="/login">Connexion</Link></Button>{' '}
        <Button variant="success"><Link to="/signup">Inscription</Link></Button>{' '}
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Accueil</h1>
                {isLoggedIn ? (
                  <p>Bienvenue, utilisateur connecté!</p>
                ) : (
                  <p>Connectez-vous pour accéder à l'accueil.</p>
                )}
              </div>
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
