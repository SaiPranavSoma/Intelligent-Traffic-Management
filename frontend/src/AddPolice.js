import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddPolice.css";

const locations = [
  "Gandhipuram",
  "R.S. Puram",
  "Peelamedu",
  "Saravanampatti",
  "Saibaba Colony",
  "Brookefields Mall",
  "Isha Yoga Center",
  "Vellingiri Hill Temple",
];

const AddPolice = () => {
  const [police, setPolice] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPolice({ ...police, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5001/add-police", {
        ...police,
        role: "police", // Ensure role is set to 'police'
      });
      setMessage(response.data.message);
      setPolice({ name: "", email: "", phone: "", location: "", password: "" });

      setTimeout(() => navigate("/admin-home"), 2000);
    } catch (error) {
      setMessage("Error adding police: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="add-police-container">
      <h2>Add New Police Officer</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
      <style>
    {`
      input::placeholder {
        color: black !important;
      }
    `}
  </style>
        <input type="text" name="name" placeholder="Name" value={police.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={police.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={police.phone} onChange={handleChange} required />

        <select name="location" value={police.location} onChange={handleChange} required>
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input type="password" name="password" placeholder="Password" value={police.password} onChange={handleChange} required />
        <button type="submit">Add Police</button>
      </form>
    </div>
  );
};

export default AddPolice;
