const express = require("express");
const router = express.Router();
const testService = require("../services/testService");

/**
 * GET /test/users
 * Get all users from database
 */
router.get("/users", async (req, res) => {
  try {
    const result = await testService.getAllUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
});

/**
 * GET /test/users/:id
 * Get user by ID
 */
router.get("/users/:id", async (req, res) => {
  try {
    const result = await testService.getUserById(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
});

/**
 * POST /test/users
 * Create a new user
 * Body: { username, userpassword }
 */
router.post("/users", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if (!username || !userpassword) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await testService.createUser(username, userpassword);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

/**
 * DELETE /test/users/:id
 * Delete user by ID
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const result = await testService.deleteUser(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

module.exports = router;
