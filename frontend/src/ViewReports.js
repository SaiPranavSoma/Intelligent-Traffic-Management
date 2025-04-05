import React, { useEffect, useState } from "react";
import "./ViewReports.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  // Fetch reports based on user email
  // Fetch reports without email filtering
useEffect(() => {
  const fetchReports = async () => {
    try {
      console.log("📡 Fetching all reports...");
      const response = await fetch(`http://localhost:5001/get-reports-admin`);
      const data = await response.json();
      console.log("📥 Reports API Response:", data);

      if (response.ok) {
        const validReports = data.filter(report => report.description);
        if (validReports.length > 0) {
          setReports(validReports);
        } else {
          setMessage("No reports found with a valid description.");
        }
      } else {
        setMessage("Failed to fetch reports.");
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setMessage("Error loading reports.");
    } finally {
      setLoading(false);
    }
  };

  fetchReports();
}, []); // Remove `email` dependency


  return (
    <div className="view-reports-page">
      <h2 className="heading">Your Incident Reports</h2>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Description</th>
              <th>Document</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.location}</td>
                <td>{report.description}</td>
                <td>
                  {report.document_path ? (
                    <a href={`http://localhost:5001${report.document_path}`} target="_blank" rel="noopener noreferrer">
                      Download Document
                    </a>
                  ) : (
                    "No Document"
                  )}
                </td>
                <td>{report.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default ViewReports;
