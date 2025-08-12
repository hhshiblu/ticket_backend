const UserQueries = require('../mysqlquery/UserQueries');

class UserService {
  constructor() {
    this.userQueries = new UserQueries();
  }

  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      const users = await this.userQueries.getAllUsers(page, limit, filters);
      return {
        success: true,
        data: users,
        message: 'Users fetched successfully'
      };
    } catch (error) {
      console.error('UserService - getAllUsers error:', error);
      return {
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      };
    }
  }

  async getUserById(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      const user = await this.userQueries.getUserById(id);
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: user,
        message: 'User fetched successfully'
      };
    } catch (error) {
      console.error('UserService - getUserById error:', error);
      return {
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      };
    }
  }

  async createUser(userData) {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'password'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return {
            success: false,
            message: `${field} is required`
          };
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      const userId = await this.userQueries.createUser(userData);
      
      return {
        success: true,
        data: { id: userId },
        message: 'User created successfully'
      };
    } catch (error) {
      console.error('UserService - createUser error:', error);
      return {
        success: false,
        message: 'Failed to create user',
        error: error.message
      };
    }
  }

  async updateUser(id, userData) {
    try {
      if (!id) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      // Check if user exists
      const existingUser = await this.userQueries.getUserById(id);
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      await this.userQueries.updateUser(id, userData);
      
      return {
        success: true,
        message: 'User updated successfully'
      };
    } catch (error) {
      console.error('UserService - updateUser error:', error);
      return {
        success: false,
        message: 'Failed to update user',
        error: error.message
      };
    }
  }

  async updateUserStatus(id, status) {
    try {
      if (!id || !status) {
        return {
          success: false,
          message: 'User ID and status are required'
        };
      }

      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: 'Invalid status'
        };
      }

      await this.userQueries.updateUserStatus(id, status);
      
      return {
        success: true,
        message: 'User status updated successfully'
      };
    } catch (error) {
      console.error('UserService - updateUserStatus error:', error);
      return {
        success: false,
        message: 'Failed to update user status',
        error: error.message
      };
    }
  }

  async deleteUser(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      // Check if user exists
      const existingUser = await this.userQueries.getUserById(id);
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      await this.userQueries.deleteUser(id);
      
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('UserService - deleteUser error:', error);
      return {
        success: false,
        message: 'Failed to delete user',
        error: error.message
      };
    }
  }

  async getUserOrders(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      const orders = await this.userQueries.getUserOrders(userId, page, limit);
      
      return {
        success: true,
        data: orders,
        message: 'User orders fetched successfully'
      };
    } catch (error) {
      console.error('UserService - getUserOrders error:', error);
      return {
        success: false,
        message: 'Failed to fetch user orders',
        error: error.message
      };
    }
  }

  async getUserFavorites(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'User ID is required'
        };
      }

      const favorites = await this.userQueries.getUserFavorites(userId);
      
      return {
        success: true,
        data: favorites,
        message: 'User favorites fetched successfully'
      };
    } catch (error) {
      console.error('UserService - getUserFavorites error:', error);
      return {
        success: false,
        message: 'Failed to fetch user favorites',
        error: error.message
      };
    }
  }

  async addToFavorites(userId, eventId) {
    try {
      if (!userId || !eventId) {
        return {
          success: false,
          message: 'User ID and Event ID are required'
        };
      }

      await this.userQueries.addToFavorites(userId, eventId);
      
      return {
        success: true,
        message: 'Event added to favorites successfully'
      };
    } catch (error) {
      console.error('UserService - addToFavorites error:', error);
      return {
        success: false,
        message: 'Failed to add event to favorites',
        error: error.message
      };
    }
  }

  async removeFromFavorites(userId, eventId) {
    try {
      if (!userId || !eventId) {
        return {
          success: false,
          message: 'User ID and Event ID are required'
        };
      }

      await this.userQueries.removeFromFavorites(userId, eventId);
      
      return {
        success: true,
        message: 'Event removed from favorites successfully'
      };
    } catch (error) {
      console.error('UserService - removeFromFavorites error:', error);
      return {
        success: false,
        message: 'Failed to remove event from favorites',
        error: error.message
      };
    }
  }

  async getUserStats() {
    try {
      const stats = await this.userQueries.getUserStats();
      
      return {
        success: true,
        data: stats,
        message: 'User stats fetched successfully'
      };
    } catch (error) {
      console.error('UserService - getUserStats error:', error);
      return {
        success: false,
        message: 'Failed to fetch user stats',
        error: error.message
      };
    }
  }

  async searchUsers(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          message: 'Search term must be at least 2 characters'
        };
      }

      const users = await this.userQueries.searchUsers(searchTerm.trim());
      
      return {
        success: true,
        data: users,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('UserService - searchUsers error:', error);
      return {
        success: false,
        message: 'Failed to search users',
        error: error.message
      };
    }
  }
}

module.exports = UserService;
