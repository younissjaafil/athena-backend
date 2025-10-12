const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/status", (req, res) =>
  res.json({
    service: "Athena Microservice",
    status: "Microservice is running successfully",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
);

// Routes
app.use("/test", testRoutes);

module.exports = app;
