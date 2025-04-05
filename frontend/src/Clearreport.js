import React, { useEffect, useState } from "react";
import "./ClearReport.css";

const ClearReport = () => {
  const [reports, setReports] = useState([]);
  const [policeLocation, setPoliceLocation] = useState("");
  const [policeEmail, setPoliceEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [progressUpdates, setProgressUpdates] = useState({}); // Track progress changes

  // Fetch police location & email from localStorage
  useEffect(() => {
    const storedLocation = localStorage.getItem("policeLocation");
    const storedEmail = localStorage.getItem("policeEmail");

    if (storedLocation) {
      setPoliceLocation(storedLocation);
      console.log("✅ Police location found:", storedLocation);
    } else {
      console.error("❌ No police location found.");
      setMessage("Police location not set.");
    }

    if (storedEmail) {
      setPoliceEmail(storedEmail);
      console.log("✅ Police email found:", storedEmail);
    } else {
      console.error("❌ No police email found.");
      setMessage("Police email not set.");
    }
  }, []);

  // Fetch reports based on police location
  useEffect(() => {
    if (!policeLocation) return;

    const fetchReports = async () => {
      try {
        console.log("📡 Fetching reports for location:", policeLocation);
        const response = await fetch(`http://localhost:5001/get-reports?location=${policeLocation}`);
        const data = await response.json();
        console.log("📥 Reports API Response:", data);

        if (response.ok) {
          setReports(data);
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
  }, [policeLocation]);

  // Handle progress change
  const handleProgressChange = (email, newProgress) => {
    setProgressUpdates({ ...progressUpdates, [email]: newProgress });
  };

  // Submit progress update
  const submitProgressUpdate = async (email) => {
    if (!progressUpdates[email]) {
      setMessage("No change in progress.");
      return;
    }

    console.log(`🔄 Updating progress for ${email}:`, progressUpdates[email]); // Debug log

    try {
      const response = await fetch(`http://localhost:5001/update-report/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: progressUpdates[email] }),
      });

      const data = await response.json(); // Read response

      if (response.ok) {
        console.log("✅ Server Response:", data);
        setReports(reports.map(report =>
          report.email === email ? { ...report, progress: progressUpdates[email] } : report
        ));
        setMessage("Progress updated successfully!");
      } else {
        console.error("❌ Failed to update progress:", data);
        setMessage("Failed to update progress.");
      }
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      setMessage("Error updating progress.");
    }
  };

  return (
    <div className="clear-report-page">
      <h2>Incident Reports - {policeLocation || "Unknown Location"}</h2>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Location</th>
              <th>Description</th>
              <th>Document</th>
              <th>Progress</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.email}>
                <td>{report.email}</td>
                <td>{report.location}</td>
                <td>{report.description}</td>
                <td>
                  {report.document_path ? (
                    <a href={`http://localhost:5001/uploads/${report.document_path}`} target="_blank" rel="noopener noreferrer">
                      Download Document
                    </a>
                  ) : (
                    "No Document"
                  )}
                </td>
                <td>
                  <select value={progressUpdates[report.email] || report.progress} 
                    onChange={(e) => handleProgressChange(report.email, e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => submitProgressUpdate(report.email)}>Submit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports found for your assigned location.</p>
      )}
    </div>
  );
};

export default ClearReport;
