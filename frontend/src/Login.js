import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("public"); // Default user type
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user type selection
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // Fetch police location using email
  const fetchPoliceLocation = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5001/get-police-location?email=${email}`);
      return response.data.location; // API returns { location: "some_location" }
    } catch (error) {
      console.error("Error fetching police location:", error);
      return null;
    }
  };

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/login", {
        email: formData.email,
        password: formData.password,
        role: userType, // Send selected role
      });

      const { role } = response.data;

      if (role === "public") {
        localStorage.setItem("user_email", formData.email);
        navigate("/public-home");
      } else if (role === "police") {
        localStorage.setItem("policeEmail", formData.email); // Store police email

        const policeLocation = await fetchPoliceLocation(formData.email);
        if (policeLocation) {
          localStorage.setItem("policeLocation", policeLocation);
        }

        navigate("/police-home");
      } else if (role === "admin") {
        navigate("/admin-home");
      }
    } catch (error) {
      if (error.response) {
        alert("Login Failed: " + error.response.data.message);
      } else {
        alert("Server error or incorrect credentials");
      }
    }
  };

  const handleBack = () => {
    navigate("/"); // Redirects to the login page after 1 second;
};

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* User Type Selection */}
      <div className="user-type-selection">
        <button 
          className={`public-btn ${userType === "public" ? "active" : ""}`} 
          onClick={() => handleUserTypeChange("public")}
        >
          Public
        </button>
        <button 
          className={`police-btn ${userType === "police" ? "active" : ""}`} 
          onClick={() => handleUserTypeChange("police")}
        >
          Police
        </button>
        <button 
          className={`admin-btn ${userType === "admin" ? "active" : ""}`} 
          onClick={() => handleUserTypeChange("admin")}
        >
          Admin
        </button>
      </div>

      {/* Login Form */}
      <form className="login-form"  onSubmit={handleLogin}>
        <input type="email" name="email"   placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {/* Forgot Password Link */}
      <p className="forgot-password">
        <a href="#" onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
      </p>

      <button className="sidebar-btn" onClick={handleBack}>
        Back
      </button>

      {/* Register for Public Users */}
      {userType === "public" && (
        <p className="register-link">
          Not registered? <a href="/register">Create an account</a>
        </p>
      )}
    </div>
  );
};

export default Login;
