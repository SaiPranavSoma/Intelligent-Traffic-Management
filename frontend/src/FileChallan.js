import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FileChallan = () => {
  const navigate = useNavigate();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [reason, setReason] = useState("");
  const [fine, setFine] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("vehicle_number", vehicleNumber);
    formData.append("reason", reason);
    formData.append("fine", fine);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5001/api/file-challan", {
        vehicle_number: vehicleNumber,
        reason,
        fine
      });
      

      alert(response.data.message);
      navigate("/police-home");
    } catch (error) {
      alert("❌ Error filing challan. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="file-challan-container">
      <h2>File Challan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Vehicle Number:
          <style>
    {`
      input::placeholder {
        color: black !important;
      }
    `}
  </style>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter vehicle number"
            required
          />
        </label>
        <label>
          Reason:
          <select value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Select Reason</option>
            <option value="Speeding">Speeding</option>
            <option value="Rash Driving">Rash Driving</option>
            <option value="Drunk Driving">Drunk Driving</option>
          </select>
        </label>
        <label>
          Fine Amount (₹):
          <input
            type="number"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
            placeholder="Enter fine amount"
            required
          />
        </label>
        <label>
          Upload Image (Optional):
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        <button type="submit">File Challan</button>
      </form>
      <button onClick={() => navigate("/police-home")}>Back to Dashboard</button>
    </div>
  );
};

export default FileChallan;
