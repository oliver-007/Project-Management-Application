"use client";

import { SessionProvider } from "next-auth/react";
import { NoteProvider } from "./context/NoteContext";
import { UserProvider } from "./context/UserContext";
import { TeamProvider } from "./context/TeamContext";

export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const NtProvider = ({ children }) => {
  return <NoteProvider>{children}</NoteProvider>;
};

export const UsProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export const TmProvider = ({ children }) => {
  return <TeamProvider>{children}</TeamProvider>;
};
