// RegistrationForm.js
import React, { useState } from "react";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter votre logique de soumission de formulaire ici
    console.log("Formulaire soumis :", formData);
    // Vous pouvez envoyer les données au serveur ou effectuer d'autres actions nécessaires
  };

  return (
    <div>
      <h2>Formulaire d'inscription</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur :
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email :
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Mot de passe :
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
