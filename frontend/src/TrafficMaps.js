import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GRAPHHOPPER_API_KEY = "d366a79f-cd67-47ef-a3c9-f64c7870f6f0";

const TrafficRouteFixed = () => {
  const [route, setRoute] = useState(null);

  // Fixed Coordinates for Delhi & Agra (Latitude, Longitude)
  const delhiCoords = [28.7041, 77.1025];
  const agraCoords = [27.1767, 78.0081];

  useEffect(() => {
    const fetchRoute = async () => {
      console.log("Fetching route from:", delhiCoords, "to", agraCoords);
      try {
        const response = await fetch(
          `https://graphhopper.com/api/1/route?point=${delhiCoords[0]},${delhiCoords[1]}&point=${agraCoords[0]},${agraCoords[1]}&profile=car&locale=en&key=${GRAPHHOPPER_API_KEY}`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (!data.paths || data.paths.length === 0) {
          alert("No route found. Try again later.");
          return;
        }

        setRoute(data.paths[0].points.coordinates.map(([lon, lat]) => [lat, lon]));
      } catch (error) {
        console.error("Error fetching route:", error);
        alert("Failed to fetch route. Please try again.");
      }
    };

    fetchRoute();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Delhi to Agra Route</h2>
      <MapContainer center={[27.94, 77.55]} zoom={7} className="h-96 w-full mt-4">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default TrafficRouteFixed;
