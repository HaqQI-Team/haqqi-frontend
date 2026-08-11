import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile, loginUser, registerUser } from "../api/authApi";
import { AuthContext } from "./AuthContext.js";
import { extractToken } from "../utils/authResponse";

const TOKEN_KEY = "haqqi_access_token";

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const loadProfile = useCallback(
    async (activeToken) => {
      try {
        const profile = await getProfile(activeToken);
        setToken(activeToken);
        setUser(profile);
        return profile;
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          clearAuth();
        }

        throw error;
      }
    },
    [clearAuth],
  );

  useEffect(() => {
    let isMounted = true;
    const storedToken = getStoredToken();

    async function restoreSession() {
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(storedToken);

        if (isMounted) {
          setToken(storedToken);
          setUser(profile);
        }
      } catch (error) {
        if (isMounted && (error.status === 401 || error.status === 403)) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearAuth]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginUser(credentials);
      const nextToken = extractToken(response);

      if (!nextToken) {
        throw new Error("Login succeeded, but no JWT token was found in the response.");
      }

      storeToken(nextToken);
      try {
        return await loadProfile(nextToken);
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [clearAuth, loadProfile],
  );

  const register = useCallback((data) => registerUser(data), []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
