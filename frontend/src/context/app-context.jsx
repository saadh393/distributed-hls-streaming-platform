import { createContext, useContext, useEffect, useState } from "react";
import useMe from "../hooks/useMe";
import { getJson } from "../lib/api";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const { data: user, setUserData, clearData } = useMe();
  const [videos, setVideos] = useState({ videos: [], error: null, state: "loading" });

  useEffect(() => {
    getJson("/feed")
      .then((data) => {
        if (data.length) {
          setVideos((prev) => ({ ...prev, videos: data }));
        }
      })
      .catch((error) => {
        console.error(error);
        setVideos((prev) => ({ ...prev, error: error }));
      })
      .finally(() => {
        setVideos((prev) => ({ ...prev, state: "idle" }));
      });
  }, []);

  return <AppContext.Provider value={{ user, setUserData, clearData, videos }}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext);
}
