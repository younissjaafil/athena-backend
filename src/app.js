const express = require("express");
const cors = require("cors");

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

module.exports = app;
