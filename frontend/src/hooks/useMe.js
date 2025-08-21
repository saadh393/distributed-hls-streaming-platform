import { useEffect, useState } from "react";

const LOCAL_ITEM_NAME = "video-streaming/user";

export default function useMe() {
  const [data, setData] = useState(() => {
    const local = localStorage.getItem(LOCAL_ITEM_NAME);
    if (local === "undefined") return null
    return local ? JSON.parse(local) ?? null : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Not authenticated") {
          setData(null);
          localStorage.removeItem(LOCAL_ITEM_NAME);
        } else {
          setData(result.user);
          localStorage.setItem(LOCAL_ITEM_NAME, JSON.stringify(result.user));
        }
      })
      .catch(e => {
        setError(e)
        console.log(e)
      })
      .finally(() => setLoading(false));
  }, []);

  function setUserData(data){
    if(data?.user?.name){
      setData(data?.user)
      localStorage.setItem(LOCAL_ITEM_NAME, JSON.stringify(data?.user))
    }
  }

  function clearData(){
    setData(null)
    localStorage.removeItem(LOCAL_ITEM_NAME)
  }



  return { loading, data, error, setUserData, clearData };
}
