const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚦 Backend is working!");
});

// 🚦 Traffic Data
let trafficData = {
  north: 10,
  south: 20,
  east: 15,
  west: 5,
};

// 🚦 Smart Signal Logic
function getGreenSignal(data) {
  return Object.keys(data).reduce((a, b) =>
    data[a] > data[b] ? a : b
  );
}

// 🔁 Simulation (updates every 3 sec)
setInterval(() => {
  trafficData = {
    north: Math.floor(Math.random() * 50),
    south: Math.floor(Math.random() * 50),
    east: Math.floor(Math.random() * 50),
    west: Math.floor(Math.random() * 50),
  };
}, 3000);

// 📡 Routes
app.get("/traffic", (req, res) => {
  res.json(trafficData);
});

app.get("/signal", (req, res) => {
  res.json({ green: getGreenSignal(trafficData) });
});

// 🚀 Start Server
app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});