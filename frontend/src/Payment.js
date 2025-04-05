import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Payment.css"; // Ensure this file is created for styling

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { challan_id, vehicle_number, fine, reason } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  useEffect(() => {
    if (!challan_id || !fine) {
      navigate("/view-fines"); // ✅ Redirect to View Fines if no data is present
    }
  }, [challan_id, fine, navigate]);

  const handlePayment = async () => {
    try {
      // 🔹 Step 1: Update payment status in the database
      await axios.post("http://localhost:5001/api/update-payment", {
        challan_id,
      });

      alert(`✅ Payment of ₹${fine} successful for ${vehicle_number}`);

      // 🔹 Step 2: Redirect to View Fines page after successful payment
      navigate("/view-fines");
    } catch (error) {
      alert("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-container">
      <h1>💳 Payment Page</h1>

      <div className="payment-details">
        <p><strong>🚗 Vehicle No:</strong> {vehicle_number}</p>
        <p><strong>📜 Reason:</strong> {reason}</p>
        <p><strong>💰 Amount:</strong> ₹{fine}</p>
      </div>

      <div className="payment-method">
        <h3>Select Payment Method:</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="credit_card">💳 Credit Card</option>
          <option value="debit_card">🏦 Debit Card</option>
          <option value="upi">📲 UPI</option>
          <option value="net_banking">🌐 Net Banking</option>
        </select>
      </div>

      <button className="confirm-payment-button" onClick={handlePayment}>
        Confirm Payment
      </button>

      <button className="back-button" onClick={() => navigate("/view-fines")}>
        ⬅ Back to Fines
      </button>
    </div>
  );
};

export default Payment;
