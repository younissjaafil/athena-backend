const express = require("express");
const router = express.Router();
const s3Service = require("../services/s3Service");

/**
 * POST /s3/upload/dummy
 * Upload a dummy test file to S3
 */
router.post("/upload/dummy", async (req, res) => {
  try {
    const result = await s3Service.uploadDummyFile();
    res.status(201).json(result);
  } catch (error) {
    console.error("Upload dummy file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload dummy file",
      error: error.message,
    });
  }
});

/**
 * POST /s3/upload/text
 * Upload a custom text file to S3
 * Body: { fileName: string, content: string }
 */
router.post("/upload/text", async (req, res) => {
  try {
    const { fileName, content } = req.body;

    if (!fileName || !content) {
      return res.status(400).json({
        success: false,
        message: "fileName and content are required",
      });
    }

    const result = await s3Service.uploadTextFile(fileName, content);
    res.status(201).json(result);
  } catch (error) {
    console.error("Upload text file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload text file",
      error: error.message,
    });
  }
});

module.exports = router;
