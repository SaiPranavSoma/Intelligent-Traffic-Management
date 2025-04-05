import React, { useState } from "react"; // Removed useEffect to fix warning
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const [policeList, setPoliceList] = useState([]);
  const [showPolice, setShowPolice] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchPoliceData = async () => {
    console.log("Fetching police data..."); // ✅ Debugging log

    try {
      const response = await fetch("http://localhost:5001/police");
      const data = await response.json();

      console.log("Police Data Response:", response.status, data); // ✅ Log response

      if (response.ok) {
        setPoliceList(data);
        setShowPolice(true);
        console.log("Police data loaded successfully"); // ✅ Success log
      } else {
        console.error("Error fetching police data:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  return (
    <div className="admin-container">
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Admin Dashboard Header */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-container">
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="feature-grid">
        <div className="feature-box" onClick={() => navigate("/add-police")}>
          <h3>➕ Add New Police</h3>
          <p>Register a new police officer in the system.</p>
        </div>
        <div className="feature-box" onClick={() => navigate("/view")}>
          <h3>📊 View Reports</h3>
          <p>Check real-time traffic reports.</p>
        </div>
        <div className="feature-box">
          <h3>🚦 Manage Traffic Rules</h3>
          <p>Update or modify traffic rules.</p>
        </div>
        <div className="feature-box" onClick={fetchPoliceData}>
          <h3>👮 Police Management</h3>
          <p>View, edit, or remove police officers.</p>
        </div>
        <div className="feature-box" onClick={() => navigate("/viewlog")}>
          <h3>📜 View Logs</h3>
          <p>Review system logs and activity history.</p>
        </div>
        <div className="feature-box" onClick={() => navigate("/generate")}>
          <h3>📜 Generate Reports</h3>
          <p>Download and analyze reports.</p>
        </div>
      </div>

      {/* Police List Display */}
      {showPolice && (
        <div className="police-list">
          <h2>Police Officers</h2>
          <ul>
            {policeList.length > 0 ? (
              policeList.map((officer, index) => (
                <li key={index}>
                  <strong>Name:</strong> {officer.name} | 
                  <strong> Badge:</strong> {officer.badgeNumber} |
                  <strong> Email:</strong> {officer.email} |
                  <strong> Phone:</strong> {officer.phone}
                </li>
              ))
            ) : (
              <p>No police officers found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
