const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({
    service: "Athena Authentication Service",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
);

// Authentication Routes
app.use("/auth", authRoutes);

module.exports = app;
