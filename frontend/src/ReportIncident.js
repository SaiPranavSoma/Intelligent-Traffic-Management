import React, { useState } from "react";
import "./ReportIncident.css";

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

const ReportIncident = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(""); // Added state for location
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !description || !email || !location) {
      setMessage("Please provide all details.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("email", email);
    formData.append("location", location); // Add location to form data

    try {
      const response = await fetch("http://localhost:5001/report-incident", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Incident reported successfully!");
      } else {
        setMessage(data.message || "Failed to report incident.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error reporting incident.");
    }
  };

  return (
    <div className="report-incident-page">
      <div className="report-container">
        <h2>Report an Incident</h2>
        <style>
    {`
      input::placeholder {
        color: black !important;
      }
    `}
  </style>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <style>
    {`
      textarea::placeholder {
        color: black !important;
      }
    `}
  </style>
        <textarea
          placeholder="Describe the incident"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        
        {/* Dropdown for selecting location */}
        <select value={location} onChange={(e) => setLocation(e.target.value)} required>
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload}>Submit Report</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ReportIncident;
