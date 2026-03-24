import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// 📊 Chart imports
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BASE_URL = "http://127.0.0.1:5000";

export default function App() {
  const [timer, setTimer] = useState(5);
  const [traffic, setTraffic] = useState(null);
  const [signal, setSignal] = useState("");
  const [loading, setLoading] = useState(true);

  const vehicles = ["🚗", "🚕", "🚌", "🚙"];

  const fetchData = async () => {
    try {
      const t = await axios.get(`${BASE_URL}/traffic`);
      const s = await axios.get(`${BASE_URL}/signal`);

      setTraffic(t.data);
      setSignal(s.data.green);
      setLoading(false);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
      setTimer(5);
    }, 5000);

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading data...</h2>;
  }

  // 📊 Chart Data
  const chartData = {
    labels: ["North", "South", "East", "West"],
    datasets: [
      {
        label: "Traffic Count",
        data: [
          traffic?.north || 0,
          traffic?.south || 0,
          traffic?.east || 0,
          traffic?.west || 0,
        ],
      },
    ],
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>🚦 Smart Traffic System</h1>

      <h2>⏱️ Next Signal Change In: {timer}s</h2>

      {/* 🚦 ROAD */}
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          margin: "40px auto",
          background: "#2c2c2c",
          borderRadius: "10px",
        }}
      >
        {/* Vertical Road */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "80px",
            height: "100%",
            transform: "translateX(-50%)",
            background: "#555",
          }}
        />

        {/* Horizontal Road */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "80px",
            transform: "translateY(-50%)",
            background: "#555",
          }}
        />

        {/* 🚦 Signals + Vehicles */}
        {["north", "south", "east", "west"].map((lane) => {
          const pos = {
            north: { top: "20px", left: "50%" },
            south: { bottom: "20px", left: "50%" },
            east: { top: "50%", right: "20px" },
            west: { top: "50%", left: "20px" },
          };

          const movement = {
            north: { y: signal === lane ? 40 : 0 },
            south: { y: signal === lane ? -40 : 0 },
            east: { x: signal === lane ? -40 : 0 },
            west: { x: signal === lane ? 40 : 0 },
          };

          return (
            <div
              key={lane}
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                ...pos[lane],
                textAlign: "center",
              }}
            >
              {/* 🚦 Signal */}
              <motion.div
                animate={{
                  backgroundColor: signal === lane ? "green" : "red",
                }}
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  margin: "auto",
                }}
              />

              {/* 🚗 MULTIPLE VEHICLES */}
              <div style={{ display: "flex", gap: "3px", marginTop: "5px" }}>
                {Array.from({
                  length: Math.min(traffic?.[lane] || 0, 5),
                }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={movement[lane]}
                    transition={{ duration: 1 }}
                    style={{ fontSize: "16px" }}
                  >
                    {vehicles[i % vehicles.length]}
                  </motion.span>
                ))}
              </div>

              <p style={{ color: "white", fontSize: "12px" }}>
                {traffic?.[lane]}
              </p>
            </div>
          );
        })}
      </div>

      {/* 📊 CHART */}
      <div style={{ width: "400px", margin: "auto" }}>
        <h2>📊 Traffic Analysis</h2>
        <Bar data={chartData} />
      </div>

      <h2>🟢 Active: {signal.toUpperCase()}</h2>
    </div>
  );
}