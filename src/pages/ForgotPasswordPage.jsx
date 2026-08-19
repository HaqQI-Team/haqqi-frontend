import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faKey,
  faLock,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
} from "../api/authApi";
import AuthInput from "../components/auth/AuthInput";
import Link from "../router/Link";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import { applyApiFieldErrors } from "../utils/formErrors";
import {
  createForgotPasswordEmailSchema,
  createForgotPasswordOtpSchema,
  createForgotPasswordResetSchema,
} from "../validation/authSchemas";

function getForgotPasswordErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (message) {
    return message;
  }

  return t(`auth.errors.status.${status}`, {
    defaultValue: t("auth.errors.status.500"),
  });
}

function ForgotPasswordPage() {
  const { i18n, t } = useTranslation();
  const { navigate } = useRouter();
  const isRtl = i18n.dir() === "rtl";

  // Internal steps: "email" | "otp" | "newPassword"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // COOLDOWN EFFECT FOR OTP RESEND
  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [resendCooldown]);

  // FORM 1: EMAIL STEP
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    clearErrors: clearEmailErrors,
    setError: setEmailError,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm({
    resolver: zodResolver(createForgotPasswordEmailSchema(t)),
    defaultValues: { email: "" },
  });

  async function onEmailSubmit(formData) {
    clearEmailErrors("root");
    setSuccessMessage("");
    try {
      await requestPasswordReset(formData.email);
      setEmail(formData.email);
      setStep("otp");
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(error, setEmailError, ["email"]);
      if (!hasFieldErrors) {
        setEmailError("root", {
          message: getForgotPasswordErrorMessage(error, t),
        });
      }
    }
  }

  // FORM 2: OTP STEP
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    clearErrors: clearOtpErrors,
    setError: setOtpError,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
  } = useForm({
    resolver: zodResolver(createForgotPasswordOtpSchema(t)),
    defaultValues: { otpCode: "" },
  });

  async function onOtpSubmit(formData) {
    clearOtpErrors("root");
    setResendStatus("");
    try {
      const result = await verifyResetOtp({
        email,
        otpCode: formData.otpCode,
      });
      setResetToken(result.resetToken);
      setStep("newPassword");
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(error, setOtpError, ["otpCode"]);
      if (!hasFieldErrors) {
        setOtpError("root", {
          message: getForgotPasswordErrorMessage(error, t),
        });
      }
    }
  }

  async function handleResendOtp() {
    clearOtpErrors("root");
    setResendStatus("");
    setIsResending(true);
    try {
      await requestPasswordReset(email);
      setResendStatus(t("auth.verify.resendSuccess"));
      setResendCooldown(30);
    } catch (error) {
      setOtpError("root", {
        message: getForgotPasswordErrorMessage(error, t),
      });
    } finally {
      setIsResending(false);
    }
  }

  // FORM 3: NEW PASSWORD STEP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    clearErrors: clearResetErrors,
    setError: setResetError,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm({
    resolver: zodResolver(createForgotPasswordResetSchema(t)),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onResetSubmit(formData) {
    clearResetErrors("root");
    setSuccessMessage("");
    try {
      await resetPassword({
        email,
        resetToken,
        newPassword: formData.newPassword,
      });
      setSuccessMessage(t("auth.forgotPassword.newPasswordStep.success"));
      setTimeout(() => {
        navigate("/login?reset=1");
      }, 1500);
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(error, setResetError, [
        "newPassword",
        "confirmPassword",
      ]);
      if (!hasFieldErrors) {
        setResetError("root", {
          message: getForgotPasswordErrorMessage(error, t),
        });
      }
    }
  }

  function handleStartOver() {
    setStep("email");
    setEmail("");
    setResetToken("");
    setResendStatus("");
    setSuccessMessage("");
  }

  const passwordToggleLabel = showPassword
    ? t("auth.actions.hidePassword")
    : t("auth.actions.showPassword");

  const confirmPasswordToggleLabel = showConfirmPassword
    ? t("auth.actions.hidePassword")
    : t("auth.actions.showPassword");

  return (
    <div className="text-start">
      {/* Title block */}
      <div className="mb-5 lg:mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
            {t("auth.forgotPassword.title")}
          </h1>
          <span className="rounded-full bg-red-900/10 px-3 py-1 text-xs font-bold text-red-900 dark:bg-red-300/10 dark:text-red-200">
            {t("auth.forgotPassword.stepIndicator", {
              current: step === "email" ? 1 : step === "otp" ? 2 : 3,
              total: 3,
            })}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      {successMessage ? (
        <div className="mb-4 rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-start text-sm font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/25 dark:text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      {/* STEP 1: Email Form */}
      {step === "email" && (
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} noValidate>
          <div className="space-y-3">
            <AuthInput
              label={t("auth.fields.email")}
              name="email"
              type="email"
              placeholder={t("auth.placeholders.email")}
              icon={faEnvelope}
              error={emailErrors.email?.message}
              registration={registerEmail("email")}
              autoComplete="email"
            />
          </div>

          {emailErrors.root?.message ? (
            <p className="mt-4 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-start text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
              {emailErrors.root.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isEmailSubmitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
          >
            <span>
              {isEmailSubmitting
                ? t("auth.verify.loading")
                : t("auth.forgotPassword.emailStep.submit")}
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className={isRtl ? "rotate-180" : ""}
            />
          </button>
        </form>
      )}

      {/* STEP 2: OTP Form */}
      {step === "otp" && (
        <form onSubmit={handleOtpSubmit(onOtpSubmit)} noValidate>
          <div className="mb-4 rounded-md border border-red-900/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-red-300/10 dark:bg-neutral-900 dark:text-neutral-300">
            <p>{t("auth.verify.sentTo")}</p>
            <span className="mt-1 inline-block break-words font-extrabold text-red-900 dark:text-red-200">
              {email}
            </span>
          </div>

          <div className="space-y-3">
            <AuthInput
              label={t("auth.fields.otp")}
              name="otpCode"
              type="text"
              placeholder={t("auth.placeholders.otp")}
              icon={faKey}
              error={otpErrors.otpCode?.message}
              registration={registerOtp("otpCode")}
              autoComplete="one-time-code"
            />
          </div>

          {otpErrors.root?.message ? (
            <p className="mt-4 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-start text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
              {otpErrors.root.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isOtpSubmitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
          >
            <span>
              {isOtpSubmitting
                ? t("auth.verify.loading")
                : t("auth.forgotPassword.otpStep.submit")}
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className={isRtl ? "rotate-180" : ""}
            />
          </button>

          <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
            <span>{t("auth.verify.resendPrompt")}</span>{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="font-bold text-red-900 transition hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:text-neutral-400 dark:text-red-200 dark:hover:text-red-100 dark:disabled:text-neutral-500"
            >
              {isResending
                ? t("auth.verify.resending")
                : resendCooldown > 0
                  ? t("auth.verify.resendCooldown", { seconds: resendCooldown })
                  : t("auth.verify.resend")}
            </button>
            {resendStatus ? (
              <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {resendStatus}
              </p>
            ) : null}
          </div>
        </form>
      )}

      {/* STEP 3: Reset Password Form */}
      {step === "newPassword" && (
        <form onSubmit={handleResetSubmit(onResetSubmit)} noValidate>
          <div className="space-y-3">
            <AuthInput
              label={t("auth.fields.password")}
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
              icon={faLock}
              error={resetErrors.newPassword?.message}
              registration={registerReset("newPassword")}
              autoComplete="new-password"
              rightButton={
                <button
                  type="button"
                  aria-label={passwordToggleLabel}
                  onClick={() => setShowPassword((current) => !current)}
                  className="rounded-md p-1 text-neutral-500 transition hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-neutral-300 dark:hover:text-red-200"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              }
            />

            <AuthInput
              label={t("auth.fields.confirmPassword")}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
              icon={faLock}
              error={resetErrors.confirmPassword?.message}
              registration={registerReset("confirmPassword")}
              autoComplete="new-password"
              rightButton={
                <button
                  type="button"
                  aria-label={confirmPasswordToggleLabel}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="rounded-md p-1 text-neutral-500 transition hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-neutral-300 dark:hover:text-red-200"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              }
            />
          </div>

          {resetErrors.root?.message ? (
            <div className="mt-4">
              <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-start text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
                {resetErrors.root.message}
              </p>
              <button
                type="button"
                onClick={handleStartOver}
                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-red-900 transition hover:text-red-700 focus-visible:outline dark:text-red-200"
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                <span>{t("auth.forgotPassword.startOver")}</span>
              </button>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isResetSubmitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
          >
            <span>
              {isResetSubmitting
                ? t("auth.verify.loading")
                : t("auth.forgotPassword.newPasswordStep.submit")}
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className={isRtl ? "rotate-180" : ""}
            />
          </button>
        </form>
      )}

      {/* Back to Login link */}
      <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
        <Link
          to="/login"
          className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
        >
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </p>

      {/* Security footer */}
      <div className="mt-5 border-t border-red-900/10 pt-4 text-center text-xs font-bold text-neutral-400 dark:border-red-300/10">
        <FontAwesomeIcon
          icon={faShieldHalved}
          className="me-2 text-red-900 dark:text-red-200"
        />
        <span>{t("auth.securityNote")}</span>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
