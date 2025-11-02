const pool = require("../config/database");

/**
 * Authentication service for user login
 */
class AuthService {
  /**
   * Login user with user_id and password
   * @param {string} user_id - User ID
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result with user data and role
   */
  async login(user_id, password) {
    const client = await pool.connect();
    try {
      // Query user by user_id and password
      const result = await client.query(
        `SELECT id, user_id, name, email, role, campus, created_at, updated_at 
         FROM users 
         WHERE user_id = $1 AND password = $2`,
        [user_id, password]
      );

      if (result.rowCount === 0) {
        return {
          success: false,
          message: "Invalid credentials",
          data: null,
        };
      }

      const user = result.rows[0];

      return {
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          campus: user.campus,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    const { user_id, name, email, role, campus, password } = userData;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (user_id, name, email, role, campus, password) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, user_id, name, email, role, campus, created_at`,
        [user_id, name, email, role, campus, password]
      );

      return {
        success: true,
        message: "User created successfully",
        data: result.rows[0],
      };
    } catch (error) {
      if (error.code === "23505") {
        // Unique violation
        throw new Error("User ID or email already exists");
      }
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user by user_id
   * @param {string} user_id - User ID
   * @returns {Promise<Object>} User data (without password)
   */
  async getUserByUserId(user_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, user_id, name, email, role, campus, created_at, updated_at 
         FROM users 
         WHERE user_id = $1`,
        [user_id]
      );

      if (result.rowCount === 0) {
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "User retrieved successfully",
        data: result.rows[0],
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all users (without passwords)
   * @returns {Promise<Object>} All users data
   */
  async getAllUsers() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, user_id, name, email, role, campus, created_at, updated_at 
         FROM users 
         ORDER BY id`
      );

      return {
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
        count: result.rowCount,
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get users by role
   * @param {string} role - User role (student, instructor, admin)
   * @returns {Promise<Object>} Users with specified role
   */
  async getUsersByRole(role) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, user_id, name, email, role, campus, created_at, updated_at 
         FROM users 
         WHERE role = $1
         ORDER BY name`,
        [role]
      );

      return {
        success: true,
        message: `${role}s retrieved successfully`,
        data: result.rows,
        count: result.rowCount,
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new AuthService();
