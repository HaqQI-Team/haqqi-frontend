import { useCallback, useEffect, useMemo, useState } from "react";
import { setApiAuthHandlers } from "../api/apiClient";
import { getProfile, loginUser, registerUser } from "../api/authApi";
import { getMySubscription } from "../api/subscriptionApi";
import { AuthContext } from "./AuthContext.js";
import {
  clearStoredAuthTokens,
  getStoredAuthTokens,
  storeAuthTokens,
} from "../utils/authTokens";

function getLoginTokens(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const { userId, accessToken, refreshToken } = response;

  if (
    typeof accessToken !== "string" ||
    !accessToken.trim() ||
    typeof refreshToken !== "string" ||
    !refreshToken.trim()
  ) {
    return null;
  }

  return {
    userId: typeof userId === "string" ? userId : null,
    accessToken,
    refreshToken,
  };
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetAuthState = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    setUser(null);
    setSubscription(null);
  }, []);

  const clearAuth = useCallback(() => {
    clearStoredAuthTokens();
    resetAuthState();
  }, [resetAuthState]);

  const refreshSubscription = useCallback(async () => {
    const activeToken = getStoredAuthTokens().accessToken || accessToken;

    if (!activeToken) {
      setSubscription(null);
      return null;
    }

    const subscriptionData = await getMySubscription(activeToken);
    setSubscription(subscriptionData);

    return subscriptionData;
  }, [accessToken]);

  useEffect(() => {
    setApiAuthHandlers({
      onTokensUpdated(nextTokens) {
        setAccessToken(nextTokens.accessToken);
        setRefreshToken(nextTokens.refreshToken);
      },
      onAuthCleared: resetAuthState,
    });

    return () => setApiAuthHandlers({});
  }, [resetAuthState]);

  const loadAuthenticatedState = useCallback(async (activeToken) => {
    const [profile, subscriptionData] = await Promise.all([
      getProfile(activeToken),
      getMySubscription(activeToken).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          throw error;
        }

        return null;
      }),
    ]);
    const storedTokens = getStoredAuthTokens();

    setAccessToken(storedTokens.accessToken || activeToken);
    setRefreshToken(storedTokens.refreshToken);
    setUser(profile);
    setSubscription(subscriptionData);

    return profile;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const storedTokens = getStoredAuthTokens();

    async function restoreSession() {
      if (!storedTokens.accessToken || !storedTokens.refreshToken) {
        clearStoredAuthTokens();
        setIsLoading(false);
        return;
      }

      try {
        await loadAuthenticatedState(storedTokens.accessToken);
      } catch {
        if (isMounted) {
          resetAuthState();
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
  }, [loadAuthenticatedState, resetAuthState]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginUser(credentials);
      const nextTokens = getLoginTokens(response);

      if (!nextTokens) {
        throw new Error("Login succeeded, but auth tokens were not returned.");
      }

      storeAuthTokens(nextTokens);
      setUserId(nextTokens.userId);

      try {
        return await loadAuthenticatedState(nextTokens.accessToken);
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [clearAuth, loadAuthenticatedState],
  );

  const register = useCallback((data) => registerUser(data), []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      userId,
      subscription,
      token: accessToken,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken && refreshToken && user),
      isLoading,
      login,
      register,
      logout,
      refreshSubscription,
    }),
    [
      accessToken,
      isLoading,
      login,
      logout,
      refreshSubscription,
      refreshToken,
      register,
      subscription,
      user,
      userId,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
