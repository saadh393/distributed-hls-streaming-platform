import { createContext, useContext } from "react";
import useMe from "../hooks/useMe";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const { data: user, loading, error, setUserData, clearData } = useMe();

  if (!loading && !user && error) {
    console.log(error);
    return "Error";
  }

  return <AppContext.Provider value={{ user, setUserData, clearData }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
