"use client";

import { useContext, createContext, useState } from "react";

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <FilterContext.Provider value={{ filterQuery, setFilterQuery }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
