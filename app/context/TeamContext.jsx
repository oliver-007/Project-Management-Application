"use client";

import { createContext, useContext, useState } from "react";

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const [allTeams, setAllTeams] = useState([]);

  return (
    <TeamContext.Provider value={{ allTeams, setAllTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
