const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");
const s3Routes = require("./routes/s3Routes");

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
app.use("/s3", s3Routes);

module.exports = app;
