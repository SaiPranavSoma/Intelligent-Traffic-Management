import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    license: "", // ✅ License number field
    vehicle_count: 0,
    vehicles: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle vehicle count change and update vehicle inputs
  const handleVehicleCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      vehicle_count: count,
      vehicles: Array(count).fill(""),
    });
  };

  // Handle vehicle number change
  const handleVehicleChange = (index, e) => {
    const newVehicles = [...formData.vehicles];
    newVehicles[index] = e.target.value;
    setFormData({ ...formData, vehicles: newVehicles });
  };

  // Handle Register Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/register", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <style>
        {`
          h2 {
            color: black !important;
          }
          input::placeholder {
            color: black !important;
          }
        `}
      </style>

      <h2>Register</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="license"
          placeholder="License Number"
          onChange={handleChange}
          required
        />

        <label>No. of vehicles Owned:</label>
        <select name="vehicle_count" onChange={handleVehicleCountChange} required>
          <option value="0">0</option>
          {[...Array(11).keys()].slice(1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {/* Dynamic vehicle number inputs */}
        {formData.vehicles.map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Vehicle ${index + 1} Number`}
            onChange={(e) => handleVehicleChange(index, e)}
            required
          />
        ))}

        <button type="submit">Register</button>
      </form>

      <p className="login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
