import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";

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
          <nav>
            <ul>
              <li>
                <Link to="/">Accueil</Link>
              </li>
              {!isLoggedIn ? (
                <li>
                  <Link to="/login">Connexion</Link>
                </li>
              ) : (
                <li>
                  <button onClick={handleLogout}>Déconnexion</button>
                </li>
              )}
            </ul>
          </nav>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
