const USERS_KEY = 'tindawise_users';
const CURRENT_USER_KEY = 'tindawise_current_user';

export const userService = {
  // Get all users
  getAllUsers: () => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Save all users
  saveAllUsers: (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Save a new user
  saveUser: (user) => {
    const users = userService.getAllUsers();
    users.push(user);
    userService.saveAllUsers(users);
  },

  // Get user by email
  getUserByEmail: (email) => {
    const users = userService.getAllUsers();
    return users.find(u => u.email === email);
  },

  // Update user
  updateUser: (updatedUser) => {
    const users = userService.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      userService.saveAllUsers(users);
    }
  },

  // Get current logged-in user
  getCurrentUser: () => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Set current logged-in user
  setCurrentUser: (user) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // Clear current user (logout)
  clearCurrentUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

};