"use client";

import { createContext, useContext, useState } from "react";

const NoteContext = createContext(null);

export const NoteProvider = ({ children }) => {
  const [allNotes, setAllNotes] = useState([]);

  return (
    <NoteContext.Provider value={{ allNotes, setAllNotes }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
