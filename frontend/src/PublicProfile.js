import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PublicProfile.css";

const PublicProfile = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user_email"); // Get logged-in email

  const [userData, setUserData] = useState({
    name: "",
    email: userEmail || "",
    phone: "",
  });

  const [updatedFields, setUpdatedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState(""); // Password field

  // Fetch user details from the server when component loads
  useEffect(() => {
    if (!userEmail) {
      navigate("/login"); // Redirect if email is missing
      return;
    }

    axios
      .get(`http://localhost:5001/api/user/${userEmail}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [userEmail, navigate]);

  // Handle input changes (track modified fields only)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission (send only modified fields)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updateData = { email: userEmail, ...updatedFields };
    if (password) updateData.password = password; // Only update password if provided
  
    if (Object.keys(updateData).length === 1) {
      setMessage("No changes made.");
      return;
    }
  
    axios
      .put("http://localhost:5001/api/user/update", updateData)
      .then(() => {
        setMessage("Profile updated successfully!");
        setUpdatedFields({});
        setPassword("");
        setTimeout(() => {
          navigate("/public-home"); // ✅ Redirect after update
        }, 1500); // Small delay for user to see success message
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setMessage("Failed to update profile. Try again.");
      });
  };
  

  return (
    <div className="profile-container">
      <h1>Update Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Name:</label>
          <style>
    {`
      input::placeholder {
        color: black !important;
      }
    `}
  </style>
          <input
            type="text"
            name="name"
            placeholder={userData.name || "Enter your name"}
            onChange={handleChange}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = userData.name || "Enter your name")}
          />

          <label>Email:</label>
          <input type="email" name="email" value={userData.email} disabled />

          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            placeholder={userData.phone || "Enter your phone number"}
            onChange={handleChange}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = userData.phone || "Enter your phone number")}
          />

          <label>New Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            onChange={handlePasswordChange}
          />

          <button type="submit">Update Profile</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PublicProfile;
