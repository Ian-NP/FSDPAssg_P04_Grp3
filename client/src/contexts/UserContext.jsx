// contexts/UserContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const fetchAndSetUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/user/${userId}`); // API endpoint to fetch user by ID

      if (response.status === 200) {
        setUser(response.data); // Update user state with fetched data
        return true; // Indicate success
      } else {
        throw new Error(`Error: ${response.statusText}`); // Throw an error for non-200 responses
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false; // Indicate failure
    }
  };

  const LogOutUser = () => {
    setUser(null); // Clear user data on logout
  };

  return (
    <UserContext.Provider value={{ user, fetchAndSetUserData, LogOutUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
