const nameKeys = [
  "name",
  "fullName",
  "userName",
  "username",
  "displayName",
  "email",
];

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
