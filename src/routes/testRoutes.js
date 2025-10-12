const express = require("express");
const router = express.Router();
const testService = require("../services/testService");

/**
 * GET /test
 * Returns dummy data for frontend connectivity testing
 */
router.get("/", (req, res) => {
  try {
    const testData = testService.getTestData();
    res.json(testData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving test data",
      error: error.message,
    });
  }
});

module.exports = router;
