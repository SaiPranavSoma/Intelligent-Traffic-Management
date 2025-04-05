import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const TrafficVideo = ({ challanId, onCompletion }) => {
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.addEventListener("contextmenu", (e) => e.preventDefault()); // ✅ Disable right-click
      video.addEventListener("pause", () => video.play()); // ✅ Prevent pausing
    }

    return () => {
      if (video) {
        video.removeEventListener("contextmenu", (e) => e.preventDefault());
        video.removeEventListener("pause", () => video.play());
      }
    };
  }, []);

  const handleVideoEnd = async () => {
    setVideoCompleted(true);
    setCanSubmit(true); // ✅ Allow user to mark fine as completed

    try {
      const response = await axios.post("http://localhost:5001/api/complete-traffic-video", {
        challan_id: challanId,
      });

      if (response.data.success) {
        alert("✅ Fine waived successfully!");
        onCompletion();
      }
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("❌ Failed to update payment status.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-full h-60"
        onEnded={handleVideoEnd} // ✅ Detect full completion
        disablePictureInPicture
        controlsList="nodownload nofullscreen noplaybackrate"
        playsInline
        autoPlay
      >
        <source src="/videos/traffic-safety.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {videoCompleted && <p className="text-green-500">✅ Video Completed</p>}

      <button
        className={`mt-3 px-4 py-2 rounded text-white ${
          canSubmit ? "bg-green-500 cursor-pointer" : "bg-gray-500 cursor-not-allowed"
        }`}
        disabled={!canSubmit}
      >
        Fine Waived
      </button>
    </div>
  );
};

export default TrafficVideo;
