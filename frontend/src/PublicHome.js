import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PublicHome.css";

const PublicHome = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>

      {/* Profile & Logout Buttons */}
      <div className="button-container">
        <button className="profile-button" onClick={() => navigate("/publicprofile")} aria-label="Profile">
          Profile
        </button>
        <button className="logout-button" onClick={handleLogout} aria-label="Logout">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="public-container">
        <h1>Public Traffic Dashboard</h1>
        <p className="clock">{time.toLocaleTimeString()}</p>

        {/* Feature Grid */}
        <div className="feature-grid">
          <div className="feature-box view-fines" title="Check any issued traffic fines">
            <h3>📜 View Fines</h3>
            <p>Check any traffic fines issued to you.</p>
            <button onClick={() => navigate("/view-fines")}>View Fines</button>
          </div>
          <div className="feature-box report-issue" title="Report a traffic issue">
            <h3>🚦 Report Issue</h3>
            <p>Report traffic violations or concerns.</p>
            <button onClick={() => navigate("/report")}>Report Issue</button>
          </div>
          <div className="feature-box view-reports" title="Check your report status">
            <h3>📊 View Reports</h3>
            <p>Know the Status of the Report</p>
            <button onClick={() => navigate("/userreport")}>View Reports</button>
          </div>
          <div className="feature-box get-directions" title="Find the best route to your destination">
            <h3>🗺️ Get Directions</h3>
            <p>Find the optimal route for your journey.</p>
            <button onClick={() => navigate("/maps")}>Get Directions</button>
          </div>
          <div className="feature-box live-traffic" title="View real-time traffic updates">
            <h3>🚗 Live Traffic Updates</h3>
            <p>See the latest traffic conditions in your area.</p>
            <button onClick={() => navigate("/traffic")}>View Traffic</button>
          </div>
          <div className="feature-box emergency-contacts" title="Find emergency helplines">
            <h3>🚨 Emergency Contacts</h3>
            <p>Get important emergency helpline numbers.</p>
            <button onClick={() => navigate("/emergency")}>View Contacts</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicHome;
