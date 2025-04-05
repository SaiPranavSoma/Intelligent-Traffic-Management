import React, { useState } from "react";
import "./Feedback.css";

const Feedback = ({ onClose }) => {
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", { rating, feedback });
    alert("Thank you for your feedback!");
    onClose(); // Close the feedback form
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Your Feedback is Valuable to Us</h2>
        <p>How satisfied are you with the content on this page?</p>

        <div className="rating">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              className={`rating-btn ${num === rating ? "selected" : ""}`}
              onClick={() => setRating(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Additional feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Feedback;
