import { apiRequest } from "./apiClient";

export function registerUser(data) {
  return apiRequest("/api/User/register", {
    method: "POST",
    body: data,
  });
}

export function loginUser(credentials) {
  return apiRequest("/api/User/login", {
    method: "POST",
    body: credentials,
  });
}

export function getProfile(token) {
  return apiRequest("/api/User/profile", {
    token,
  });
}
