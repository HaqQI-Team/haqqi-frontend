import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9]+$/;
const phonePattern = /^\d{11}$/;
const uppercasePattern = /[A-Z]/;
const lowercasePattern = /[a-z]/;
const digitPattern = /\d/;
const specialCharacterPattern = /[^A-Za-z0-9]/;

export function createLoginSchema(t) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("auth.validation.emailRequired"))
      .regex(emailPattern, t("auth.validation.emailInvalid")),
    password: z.string().min(1, t("auth.validation.passwordRequired")),
  });
}

export function createRegisterSchema(t) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t("auth.validation.nameRequired"))
        .max(50, t("auth.validation.nameMax")),
      username: z
        .string()
        .trim()
        .min(1, t("auth.validation.usernameRequired"))
        .regex(usernamePattern, t("auth.validation.usernameInvalid")),
      email: z
        .string()
        .trim()
        .min(1, t("auth.validation.emailRequired"))
        .regex(emailPattern, t("auth.validation.emailInvalid")),
      password: z
        .string()
        .min(1, t("auth.validation.passwordRequired"))
        .min(8, t("auth.validation.passwordMin"))
        .regex(uppercasePattern, t("auth.validation.passwordUppercase"))
        .regex(lowercasePattern, t("auth.validation.passwordLowercase"))
        .regex(digitPattern, t("auth.validation.passwordDigit"))
        .regex(specialCharacterPattern, t("auth.validation.passwordSpecial")),
      confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
      phoneNumber: z
        .string()
        .trim()
        .min(1, t("auth.validation.phoneRequired"))
        .regex(phonePattern, t("auth.validation.phoneDigits")),
      acceptedTerms: z.literal(true, {
        error: () => t("auth.validation.termsRequired"),
      }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      path: ["confirmPassword"],
      message: t("auth.validation.passwordMatch"),
    });
}

export function createVerifyEmailSchema(t) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("auth.validation.emailRequired"))
      .regex(emailPattern, t("auth.validation.emailInvalid")),
    otp: z.string().trim().min(1, t("auth.validation.otpRequired")),
  });
}
