const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

/**
 * @route   POST /auth/login
 * @desc    Login user with user_id and password
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Validation
    if (!user_id || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
        data: null,
      });
    }

    const result = await authService.login(user_id, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

/**
 * @route   POST /auth/register
 * @desc    Create a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { user_id, name, email, role, campus, password } = req.body;

    // Validation
    if (!user_id || !name || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields: user_id, name, email, role, password",
        data: null,
      });
    }

    // Validate role
    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be one of: student, instructor, admin",
        data: null,
      });
    }

    const result = await authService.createUser({
      user_id,
      name,
      email,
      role,
      campus,
      password,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error);

    if (error.message.includes("already exists")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
});

/**
 * @route   GET /auth/user/:user_id
 * @desc    Get user by user_id
 * @access  Public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await authService.getUserByUserId(user_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving user",
      error: error.message,
    });
  }
});

/**
 * @route   GET /auth/users
 * @desc    Get all users
 * @access  Public
 */
router.get("/users", async (req, res) => {
  try {
    const result = await authService.getAllUsers();
    res.json(result);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving users",
      error: error.message,
    });
  }
});

/**
 * @route   GET /auth/users/role/:role
 * @desc    Get users by role (student, instructor, admin)
 * @access  Public
 */
router.get("/users/role/:role", async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be one of: student, instructor, admin",
      });
    }

    const result = await authService.getUsersByRole(role);
    res.json(result);
  } catch (error) {
    console.error("Get users by role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving users",
      error: error.message,
    });
  }
});

module.exports = router;
