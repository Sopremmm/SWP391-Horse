import React, { useState } from "react";
import bgImage from "./horse_race_cartoon.png"; 

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    role: "horse owner",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register with:", formData);
    // TODO: call register API here
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "10px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="horse owner">Horse Owner</option>
              <option value="jockey">Jockey</option>
              <option value="spectator">Spectator</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
