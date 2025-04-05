import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ClearReport.css";

const StatusUpdate = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch reports from the backend
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/status-update");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="clear-report-container">
      <h2>Incident Reports - View Status</h2>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Image</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.email}</td>
                <td>{report.description}</td>
                <td>{report.severity ? report.severity : "Not Set"}</td>
                <td>
                  <img src={`http://localhost:5001${report.document_path}`} alt="Incident" className="report-image" />
                </td>
                <td>{report.progress ? report.progress : "Not Set"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatusUpdate;
