import React, { useState } from "react";
import "./viewlogs.css"; // Ensure you have this CSS file

function Viewlog() {
    const [role, setRole] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (selectedRole) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/recent-logins?role=${selectedRole}`);
            if (!response.ok) throw new Error("Failed to fetch logs");
            const data = await response.json();
            setLogs(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fullscreen-container">
            <h1 className="heading">User Login Logs</h1>

            {!role ? (
                <div className="button-container">
                    <button className="button public-btn" onClick={() => { setRole("public"); fetchLogs("public"); }}>Public</button>
                    <button className="button police-btn" onClick={() => { setRole("police"); fetchLogs("police"); }}>Police</button>
                </div>
            ) : (
                <div className="table-container">
                    <button className="button back-btn" onClick={() => setRole(null)}>Back</button>

                    {loading && <p className="loading">Loading logs...</p>}
                    {error && <p className="error">{error}</p>}

                    {!loading && !error && logs.length > 0 ? (
                        <>
                            <h2 className="heading">{role.charAt(0).toUpperCase() + role.slice(1)} Login Logs</h2>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Last Login</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log.id}>
                                                <td>{log.id}</td>
                                                <td>{log.email}</td>
                                                <td>{log.last_login}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        !loading && !error && <p className="error">No logs found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Viewlog;
