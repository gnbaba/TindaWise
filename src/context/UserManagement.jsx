import React, { createContext, useState, useEffect } from 'react';
import { userService } from './UserService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const loadedUser = userService.getCurrentUser();
    if (loadedUser) {
      setCurrentUser(loadedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Register new user
  const register = (userData) => {
    const newUser = {
      id: Date.now(), // Temporary ID 
      uid: null, // Backend API
      username: userData.username,
      email: userData.email,
      password: userData.password, 
      role: 'Owner', 
      profilePicture: 'https://cdn-icons-png.flaticon.com/512/847/847969.png', 
      phone: '', 
      dateOfBirth: '', 
      createdAt: new Date().toISOString()
    };

    //LocalStorage saved but will be change for backend
    userService.saveUser(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    
    return newUser;
  };

  // Login user
  const login = (email, password) => {
    //Saved in localstorage for checking. Change for proper auth
    const user = userService.getUserByEmail(email);
    
    if (user && user.password === password) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      userService.setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  // Logout user
  const logout = () => {
    userService.clearCurrentUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = (updates) => {
    const updatedUser = {
      ...currentUser,
      ...updates
    };
    
    userService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    userService.setCurrentUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      isAuthenticated,
      register,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};