export const ACCESS_TOKEN_KEY = "haqqi_access_token";
export const REFRESH_TOKEN_KEY = "haqqi_refresh_token";

function cleanToken(token) {
  return typeof token === "string" && token.trim() ? token.trim() : null;
}

export function getStoredAuthTokens() {
  return {
    accessToken: cleanToken(localStorage.getItem(ACCESS_TOKEN_KEY)),
    refreshToken: cleanToken(localStorage.getItem(REFRESH_TOKEN_KEY)),
  };
}

export function storeAuthTokens({ accessToken, refreshToken }) {
  const nextAccessToken = cleanToken(accessToken);
  const nextRefreshToken = cleanToken(refreshToken);

  if (!nextAccessToken || !nextRefreshToken) {
    clearStoredAuthTokens();
    return null;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  };
}

export function clearStoredAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
