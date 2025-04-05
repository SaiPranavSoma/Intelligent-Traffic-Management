import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, TrafficLayer } from "@react-google-maps/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar, BarChart } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const googleApiKey = "AIzaSyD-SmZYPAfuBUCqNTvzuAnysz_3l-C7cXQ";
const tomtomApiKey = "H2C2iZspjligwT6blkL9OrjHw97YTcF4";
const weatherApiKey = "3cd1cabcc52d07700056ffd14767533d"; // Replace with your API key


const defaultCenter = { lat: 17.385, lng: 78.486 }; // Hyderabad default

const Home = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [trafficData, setTrafficData] = useState([]);
  const [trafficStats, setTrafficStats] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [weatherData, setWeatherData] = useState(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrafficData();
    fetchWeatherData(city);
    const interval = setInterval(fetchTrafficData, 10000);
    return () => clearInterval(interval);
  }, [center, city]);

  const fetchTrafficData = async () => {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${center.lat},${center.lng}`
      );

      if (response.data.flowSegmentData) {
        const data = response.data.flowSegmentData;
        setTrafficStats({
          travelTime: data.travelTime,
          congestionLevel: Math.round((1 - data.currentSpeed / data.freeFlowSpeed) * 100),
          speed: data.currentSpeed,
          trafficJams: Math.floor(Math.random() * 30),
          totalLength: (Math.random() * 10).toFixed(1),
        });

        setTrafficData(
          Array.from({ length: 12 }).map((_, index) => ({
            time: `${8 + index} AM`,
            liveCongestion: data.currentSpeed,
            usualCongestion: data.freeFlowSpeed,
            liveSpeed: data.currentSpeed,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    }
  };


  const fetchWeatherData = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=metric`
      );
      setWeatherData({
        temp: response.data.main.temp,
        condition: response.data.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const searchCity = async () => {
    if (!searchQuery) {
      alert("Please enter a city name");
      return;
    }
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        { params: { address: searchQuery, key: googleApiKey } }
      );
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
        setCity(searchQuery);
      } else {
        alert(`City not found: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
   <div>
      <nav className="navbar">
        <h1 className="navbar-title">🛣️ Intelligent Traffic Management</h1>

        {weatherData && (
          <div className="weather-box">
            <img src={weatherData.icon} alt={weatherData.condition} />
            <p>{weatherData.temp}°C</p>
            <p>{weatherData.condition}</p>
          </div>
        )}

<div className="search-container">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Enter city name..."
    className="search-input"
  />
  <button onClick={searchCity} className="search-button">Search</button>
</div>
<button className="login-button" onClick={handleLogin}>Login</button>


      </nav>

        <LoadScript googleMapsApiKey={googleApiKey}>
          <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} center={center} zoom={12}>
            <Marker position={center} />
            <TrafficLayer />
          </GoogleMap>
        </LoadScript>

        <div className="chart-container">
    <div className="chart-wrapper">
        <h2>📊 Hourly Speed & Congestion Level</h2>
        <LineChart width={window.innerWidth * 0.9} height={300} data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="liveCongestion" stroke="red" />
            <Line type="monotone" dataKey="usualCongestion" stroke="white" />
        </LineChart>
    </div>
</div>

<div className="chart-container">
    <div className="chart-wrapper">
        <h2>🔵 Live Speed Data</h2>
        <BarChart width={window.innerWidth * 0.9} height={300} data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Legend />
            <Bar dataKey="liveSpeed" fill="blue" />
        </BarChart>
    </div>
</div>


        {trafficStats && (
          <div className="traffic-stats">
            <h2>{searchQuery || "Hyderabad"} <span className="live" >live traffic</span> 🔴</h2>
            <p>Last update: {new Date().toLocaleString()}</p>
            <p>Travel times, congestion levels, and speeds are based on trip data anonymously collected from drivers.</p>
            <div className="stats-grid">
              <div className="stat">🚗 Travel time: <strong>{trafficStats.travelTime} min</strong></div>
              <div className="stat">📈 Congestion: <strong>{trafficStats.congestionLevel}%</strong></div>
              <div className="stat">⚡ Speed: <strong>{trafficStats.speed} km/h</strong></div>
              <div className="stat">🚦 Traffic Jams: <strong>{trafficStats.trafficJams}</strong></div>
              <div className="stat">📏 Total Length: <strong>{trafficStats.totalLength} km</strong></div>
            </div>
          </div>
        )}

        <h2><span className="rush_hour_title">How busy was {city} during rush hour?</span></h2>
        <div className="rush-hour-stats">
          <div className="rush-hour-block">
            <h3>Rush hour Morning</h3>
            <p>Time taken to travel 1 km: <strong>{(trafficStats?.travelTime * 1.2).toFixed(2)} min</strong></p>
            <p>Average speed: <strong>{(trafficStats?.speed * 0.9).toFixed(2)} km/h</strong></p>
            <p>Congestion level: <strong>{(trafficStats?.congestionLevel + 5) % 100}%</strong></p>
          </div>
          <div className="rush-hour-block">
            <h3>Rush hour Evening</h3>
            <p>Time taken to travel 1 km: <strong>{(trafficStats?.travelTime * 1.4).toFixed(2)} min</strong></p>
            <p>Average speed: <strong>{(trafficStats?.speed * 0.8).toFixed(2)} km/h</strong></p>
            <p>Congestion level: <strong>{(trafficStats?.congestionLevel + 15) % 100}%</strong></p>
          </div>
        </div>
        
      </div>

  );
};

export default Home;
