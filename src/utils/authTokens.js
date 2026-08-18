export const ACCESS_TOKEN_KEY = "haqqi_access_token";

function cleanToken(token) {
  return typeof token === "string" && token.trim() ? token.trim() : null;
}

export function getStoredAuthTokens() {
  return {
    accessToken: cleanToken(localStorage.getItem(ACCESS_TOKEN_KEY)),
  };
}

export function storeAuthTokens({ accessToken }) {
  const nextAccessToken = cleanToken(accessToken);

  if (!nextAccessToken) {
    clearStoredAuthTokens();
    return null;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);

  return { accessToken: nextAccessToken };
}

export function clearStoredAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
