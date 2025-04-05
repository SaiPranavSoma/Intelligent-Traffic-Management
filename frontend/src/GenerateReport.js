import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer
} from "recharts";
import "./GenerateReport.css";

const UserLocationStats = () => {
  const [locationData, setLocationData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [challanData, setChallanData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/user-locations")
      .then((res) => res.json())
      .then((data) => {
        setLocationData(data.map((item) => ({
          location: item.location,
          count: Number(item.count),
        })));
      })
      .catch((error) => console.error("Error fetching location data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5001/api/user-progress")
      .then((res) => res.json())
      .then((data) => {
        setProgressData(data.map((item) => ({
          progress: item.progress,
          count: Number(item.count),
        })));
      })
      .catch((error) => console.error("Error fetching progress data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5001/api/challan-status")
      .then((res) => res.json())
      .then((data) => {
        setChallanData(data.map((item) => ({
          status: item.payment_status,
          amount: Number(item.amount),
        })));
      })
      .catch((error) => console.error("Error fetching challan data:", error));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#A28CFF"];
  const STATUS_COLORS = {
    Open: "#FF5733",
    "In Progress": "#FFC300",
    Closed: "#4CAF50",
    Pending: "#FF0000",
    Completed: "#008000"
  };

  return (
    <div className="container">
      <h2 className="title">Users & Challan Statistics</h2>

      <div className="charts-wrapper">
        {/* 1. Users by Location - Bar Chart */}
        <div className="chart">
          <h3>Users by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <XAxis dataKey="location" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Users by Location - Pie Chart */}
        <div className="chart">
          <h3>Users by Location (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={locationData} dataKey="count" nameKey="location" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Progress Statistics - Bar Chart */}
        <div className="chart">
          <h3>Progress Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <XAxis dataKey="progress" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.progress] || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Progress Breakdown - Pie Chart */}
        <div className="chart">
          <h3>Progress Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={progressData} dataKey="count" nameKey="progress" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.progress] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Challan Status - Bar Chart */}
        <div className="chart">
          <h3>Challan Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={challanData}>
              <XAxis dataKey="status" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount">
                {challanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6. Challan Status - Pie Chart */}
        <div className="chart">
          <h3>Challan Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={challanData} dataKey="amount" nameKey="status" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {challanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserLocationStats;
