import React, { useState } from "react";
import axios from "axios";



const ViewChallan = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [challanData, setChallanData] = useState(null);
  const [error, setError] = useState(null);

  const fetchChallanDetails = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5001/api/view-challan/${vehicleNumber}`);
      setChallanData(response.data);
    } catch (err) {
      setError("No details found for this vehicle number");
      setChallanData(null);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">🔍 View Challan Details</h2>

      {/* Vehicle Number Input */}
      <div className="mb-4">
      <style>
    {`
      input::placeholder {
        color: black !important;
      }
    `}
  </style>

  <input
    type="text"
    placeholder="Enter Vehicle Number"
    value={vehicleNumber}
    onChange={(e) => setVehicleNumber(e.target.value)}
    className="border p-2 rounded"
  />



        <button onClick={fetchChallanDetails} className="ml-2 bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {challanData && (
        <div>
          {/* User Details Table */}
          <h3 className="text-xl font-semibold mt-4">👤 User Details</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border">
                <td className="border p-2">{challanData.user.name}</td>
                <td className="border p-2">{challanData.user.email}</td>
                <td className="border p-2">{challanData.user.phone}</td>
              </tr>
            </tbody>
          </table>

          {/* Challan History Table */}
          <h3 className="text-xl font-semibold mt-4">🚗 Challan History</h3>
          {challanData.challans.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Reason</th>
                  <th className="border p-2">Fine (₹)</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {challanData.challans.map((challan, index) => (
                  <tr key={index}>
                    <td className="border p-2">{challan.reason}</td>
                    <td className="border p-2">₹{challan.fine}</td>
                    <td className="border p-2">{new Date(challan.created_at).toLocaleDateString()}</td>
                    <td className="border p-2">
                      {challan.payment_status === "pending" ? "Pending ❌" : "Completed ✅"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No challans found for this vehicle.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewChallan;
