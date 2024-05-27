import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Biblio from "./Biblio";


const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si un token existe dans le stockage local
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Supprimer le token du stockage local lors de la déconnexion
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="btn btn-primary">Accueil</Link>{' '}
          {!isLoggedIn && <Link to="/login" className="btn btn-secondary">Connexion</Link>}{' '}
          {!isLoggedIn && <Link to="/signup" className="btn btn-success">Inscription</Link>}{' '}
          {isLoggedIn && <Link to="/Biblio" className="btn btn-success">Biblio</Link>}
          {isLoggedIn && <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>}
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Accueil</h1>
                {isLoggedIn ? (
                  <p>Bienvenue, Vous êtes désormais connecté!</p>
                ) : (
                  <p>Connectez-vous pour accéder à l'accueil.</p>
                )}
              </div>
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/signup" element={<Signup />} />
          {/* Utilisation de la route /biblio avec une condition ternaire */}
          <Route path="/Biblio" element={isLoggedIn ? <Biblio /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
