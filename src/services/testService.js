const pool = require("../config/database");

/**
 * Test service for database interaction
 */
class TestService {
  /**
   * Get all users from testdbuser table
   * @returns {Promise<Object>} User data from database
   */
  async getAllUsers() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, username, created_at FROM testdbuser ORDER BY id"
      );

      return {
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
        count: result.rowCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, username, created_at FROM testdbuser WHERE id = $1",
        [id]
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
   * Create a new user
   * @param {string} username - Username
   * @param {string} userpassword - User password
   * @returns {Promise<Object>} Created user data
   */
  async createUser(username, userpassword) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "INSERT INTO testdbuser (username, userpassword) VALUES ($1, $2) RETURNING id, username, created_at",
        [username, userpassword]
      );

      return {
        success: true,
        message: "User created successfully",
        data: result.rows[0],
      };
    } catch (error) {
      if (error.code === "23505") {
        // Unique violation
        throw new Error("Username already exists");
      }
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUser(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "DELETE FROM testdbuser WHERE id = $1 RETURNING id, username",
        [id]
      );

      if (result.rowCount === 0) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "User deleted successfully",
        data: result.rows[0],
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new TestService();
