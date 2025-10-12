/**
 * Test service for frontend connectivity verification
 */
class TestService {
  /**
   * Get dummy test data
   * @returns {Object} Test data with timestamp
   */
  getTestData() {
    return {
      success: true,
      message: "Backend connection successful",
      data: {
        users: [
          { id: 1, name: "Alice Johnson", email: "alice@example.com" },
          { id: 2, name: "Bob Smith", email: "bob@example.com" },
          { id: 3, name: "Carol Williams", email: "carol@example.com" },
        ],
        stats: {
          totalUsers: 3,
          activeConnections: 42,
          uptime: "99.9%",
        },
      },
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }
}

module.exports = new TestService();
