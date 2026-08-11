const tokenKeys = [
  "token",
  "accessToken",
  "access_token",
  "jwt",
  "jwtToken",
  "authToken",
];

const nameKeys = [
  "name",
  "fullName",
  "userName",
  "username",
  "displayName",
  "email",
];

export function extractToken(response) {
  if (typeof response === "string" && response.trim()) {
    return response.trim();
  }

  if (!response || typeof response !== "object") {
    return null;
  }

  for (const key of tokenKeys) {
    const value = response[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  for (const value of Object.values(response)) {
    if (value && typeof value === "object") {
      const nestedToken = extractToken(value);

      if (nestedToken) {
        return nestedToken;
      }
    }
  }

  return null;
}

export function getProfileDisplayName(user) {
  if (!user || typeof user !== "object") {
    return "";
  }

  for (const key of nameKeys) {
    const value = user[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}
