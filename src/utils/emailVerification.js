const PENDING_VERIFICATION_EMAIL_KEY = "haqqi_pending_verification_email";

export function getPendingVerificationEmail() {
  return sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) ?? "";
}

export function storePendingVerificationEmail(email) {
  if (typeof email === "string" && email.trim()) {
    sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email.trim());
  }
}

export function clearPendingVerificationEmail() {
  sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
}
