"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);

  return (
    <UserContext.Provider value={{ allUsers, setAllUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
