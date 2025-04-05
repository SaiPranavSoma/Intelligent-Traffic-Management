import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrafficVideo from "./TrafficVideo";

const ViewFines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoForChallan, setShowVideoForChallan] = useState(null);
  const [licenseStatus, setLicenseStatus] = useState("active");

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");

    if (!userEmail) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5001/api/view-fines?email=${userEmail}`)
      .then((response) => {
        setFines(response.data.fines || []);
        setLicenseStatus(response.data.license_status || "active");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch fines. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleVideoCompletion = (challanId) => {
    setShowVideoForChallan(null);
    setFines((prev) =>
      prev.map((fine) =>
        fine.challan_id === challanId ? { ...fine, payment_status: "completed" } : fine
      )
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-4 bg-gray-900 text-white relative">
      {/* Back to Dashboard Button */}
      <button
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
        onClick={() => navigate("/public-home")}
      >
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Issued Fines</h2>

      {/* 🚫 Blocked License Message */}
      {fines.some((fine) => fine.challan_count >= 5) && (
        <div className="bg-red-600 text-white font-bold p-3 mb-4 rounded shadow-md border border-red-400 text-center w-full">
          🚫 Your License is BLOCKED. Please Visit The Police Station in Your Area
        </div>
      )}

      {loading ? (
        <p>Loading fines...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : fines.length === 0 ? (
        <p>No fines found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-black bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Challan ID</th>
              <th className="border p-2">Vehicle Number</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Fine (₹)</th>
              <th className="border p-2">Timestamp</th>
              <th className="border p-2">Challan Count</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">License Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.challan_id} className="border">
                <td className="border p-2">{fine.challan_id}</td>
                <td className="border p-2">{fine.vehicle_number}</td>
                <td className="border p-2">{fine.reason}</td>
                <td className="border p-2">₹{fine.fine}</td>
                <td className="border p-2">
                  {new Date(fine.timestamp).toLocaleString()}
                </td>
                <td className="border p-2">{fine.challan_count}</td>
                <td className="border p-2">
                  {fine.payment_status === "completed" ? (
                    <span className="text-green-600 font-bold">Completed</span>
                  ) : (
                    <span className="text-red-600 font-bold">Pending</span>
                  )}
                </td>
                <td className="border p-2">
                  {licenseStatus.toLowerCase() === "blocked" ? (
                    <span className="text-red-600 font-bold">Blocked</span>
                  ) : (
                    <span className="text-white font-bold">Active</span>
                  )}
                </td>
                <td className="border p-2">
                  {fine.challan_count === 1 && fine.payment_status === "pending" ? (
                    showVideoForChallan === fine.challan_id ? (
                      <TrafficVideo
                        challanId={fine.challan_id}
                        onCompletion={() => handleVideoCompletion(fine.challan_id)}
                      />
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => setShowVideoForChallan(fine.challan_id)}
                      >
                        Watch Video
                      </button>
                    )
                  ) : fine.payment_status === "pending" &&
                    fine.challan_count < 5 ? (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => navigate("/payment", { state: fine })}
                    >
                      Pay
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewFines;
