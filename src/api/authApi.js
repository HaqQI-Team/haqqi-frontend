import { apiRequest } from "./apiClient";

export function registerUser(data) {
  return apiRequest("/api/User/register", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
    skipAuth: true,
  });
}

export function getProfile(token) {
  return apiRequest("/api/auth/profile", {
    token,
  });
}

export function verifyEmail(data) {
  return apiRequest("/api/User/verify-email", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export function resendOtp(data) {
  return apiRequest("/api/User/resend-otp", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export function requestPasswordReset(email) {
  return apiRequest("/api/User/forgot-password", {
    method: "POST",
    body: { email },
    skipAuth: true,
  });
}

export function verifyResetOtp({ email, otpCode }) {
  return apiRequest("/api/User/verify-otp", {
    method: "POST",
    body: { email, otpCode },
    skipAuth: true,
  });
}

export function resetPassword({ email, resetToken, newPassword }) {
  return apiRequest("/api/User/reset-password", {
    method: "POST",
    body: { email, resetToken, newPassword },
    skipAuth: true,
  });
}

