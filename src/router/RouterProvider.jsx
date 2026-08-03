import { useEffect, useMemo, useState } from "react";
import { RouterContext } from "./RouterContext";

function getCurrentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

function RouterProvider({ children }) {
  const [location, setLocation] = useState(getCurrentLocation);

  useEffect(() => {
    function handleLocationChange() {
      setLocation(getCurrentLocation());
    }

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("haqqi:navigate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("haqqi:navigate", handleLocationChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      location,
      navigate(to) {
        const currentPath =
          window.location.pathname + window.location.search + window.location.hash;

        if (to !== currentPath) {
          window.history.pushState({}, "", to);
          window.dispatchEvent(new Event("haqqi:navigate"));
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      },
    }),
    [location],
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export default RouterProvider;
