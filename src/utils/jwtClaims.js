export const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function decodeBase64Url(value) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    "=",
  );

  return window.atob(paddedValue);
}

export function decodeJwtPayload(token) {
  if (typeof token !== "string" || !token.trim()) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const decodedPayload = decodeURIComponent(
      Array.from(decodeBase64Url(payload))
        .map((character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
        )
        .join(""),
    );

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function getUserRoleFromToken(token) {
  const payload = decodeJwtPayload(token);
  const role = payload?.[ROLE_CLAIM];

  return typeof role === "string" ? role : "";
}

export function isAdminRole(role) {
  return String(role ?? "").toLowerCase() === "admin";
}
