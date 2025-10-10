import { createContext } from "react";

export const Usercontext = createContext();

export const initialUserState = {
  loggedUser: null,
  isLoading: true,
  error: null
};