import { createContext, useContext } from "react";

export const TokenContext = createContext<string | null>(null);

export const useToken = () => {
  const token = useContext(TokenContext);
  if (!token) {
    throw new Error("useToken must be used within TokenProvider");
  }
  return token;
};
