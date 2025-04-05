import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";

const googleApiKey = "AIzaSyD-SmZYPAfuBUCqNTvzuAnysz_3l-C7cXQ"; // Replace with your API Key
const tomtomApiKey = "H2C2iZspjligwT6blkL9OrjHw97YTcF4"; // Replace with your TomTom API Key

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 17.385, lng: 78.486 }; // Hyderabad default

const Home = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [center, setCenter] = useState(defaultCenter);
  const [routePath, setRoutePath] = useState([]);
  const [routeColor, setRouteColor] = useState("blue");
  const [travelTime, setTravelTime] = useState("");

  const getCoordinates = async (place) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        { params: { address: place, key: googleApiKey } }
      );
      if (response.data.status === "OK") {
        return response.data.results[0].geometry.location;
      } else {
        alert(`Location not found: ${response.data.status}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location. Check console for details.");
      return null;
    }
  };

  const getTrafficData = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${lat},${lng}`
      );
      return response.data.flowSegmentData || null;
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      return null;
    }
  };

  const fetchRoute = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination");
      return;
    }
  
    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);
  
    if (!sourceCoords || !destCoords) return;
  
    try {
      const response = await axios.post(
        `https://routes.googleapis.com/directions/v2:computeRoutes`,
        {
          origin: { location: { latLng: { latitude: sourceCoords.lat, longitude: sourceCoords.lng } } },
          destination: { location: { latLng: { latitude: destCoords.lat, longitude: destCoords.lng } } },
          travelMode: "DRIVE",
          computeAlternativeRoutes: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": googleApiKey,
            "X-Goog-FieldMask": "routes.distanceMeters,routes.polyline.encodedPolyline",
          },
        }
      );
  
      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const decodedPath = window.google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
  
        const distanceKm = (route.distanceMeters / 1000).toFixed(2);
        const estimatedTimeInSeconds = (distanceKm / 100) * (2 * 3600);
        const hours = Math.floor(estimatedTimeInSeconds / 3600);
        const minutes = Math.floor((estimatedTimeInSeconds % 3600) / 60);
        const seconds = Math.floor(estimatedTimeInSeconds % 60);
  
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
        setRoutePath(decodedPath);
        setTravelTime(`Estimated time: ${formattedTime} | Distance: ${distanceKm} km`);
  
        const midIndex = Math.floor(decodedPath.length / 2);
        const midPoint = decodedPath[midIndex];
  
        const trafficData = await getTrafficData(midPoint.lat(), midPoint.lng());
  
        let color = "green";
        if (trafficData) {
          const { currentSpeed, freeFlowSpeed } = trafficData;
          const congestionLevel = (currentSpeed / freeFlowSpeed) * 100;
  
          if (congestionLevel < 50) color = "red";
          else if (congestionLevel < 80) color = "yellow";
        }
  
        setRouteColor(color);
        setCenter(sourceCoords);
      } else {
        alert("No route found!");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Failed to fetch route. Check console for details.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1 className="navbar-title">🛣️ Intelligent Traffic Management System</h1>
      </nav>

      <div className="content">
        <div className="search-container">
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Enter source..." className="search-input" />
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter destination..." className="search-input" />
          <button onClick={fetchRoute} className="search-button">Get Route</button>
        </div>

        <LoadScript googleMapsApiKey={googleApiKey} libraries={["geometry"]}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {routePath.length > 0 && (
              <Polyline path={routePath} options={{ strokeColor: routeColor, strokeWeight: 5 }} />
            )}
            {source && <Marker position={center} label="Source" />}
          </GoogleMap>
        </LoadScript>

        <h2 className="traffic-alert">{travelTime}</h2>
      </div>
    </div>
  );
};

export default Home;
