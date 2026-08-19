import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/auth/AuthInput";
import Link from "../router/Link";
import { useAuth } from "../hooks/useAuth";
import OAuthButtons from "../components/auth/OAuthButtons";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import { applyApiFieldErrors } from "../utils/formErrors";
import { createLoginSchema } from "../validation/authSchemas";

function getLoginErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");
  const normalizedMessage = message.toLowerCase();

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (status === 400 && normalizedMessage.includes("email or password")) {
    return t("auth.errors.invalidCredentials");
  }

  if (message) {
    return message;
  }

  return t(`auth.errors.status.${status}`, {
    defaultValue: t("auth.errors.loginFailed"),
  });
}

function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { location, navigate } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const registrationSucceeded =
    new URLSearchParams(location.search).get("registered") === "1";
  const emailVerified =
    new URLSearchParams(location.search).get("verified") === "1";
  const resetSucceeded =
    new URLSearchParams(location.search).get("reset") === "1";
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData) {
    clearErrors("root");

    try {
      const authResult = await login(formData);

      navigate(authResult?.isAdmin ? "/admin/dashboard" : "/");
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(error, setError, [
        "email",
        "password",
      ]);

      if (!hasFieldErrors) {
        setError("root", {
          message: getLoginErrorMessage(error, t),
        });
      }
    }
  }

  const passwordToggleLabel = showPassword
    ? t("auth.actions.hidePassword")
    : t("auth.actions.showPassword");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="text-start">
      <div className="mb-5 lg:mb-4">
        <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
          {t("auth.login.title")}
        </h1>
        <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {registrationSucceeded || emailVerified || resetSucceeded ? (
          <p className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-start text-sm font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/25 dark:text-emerald-300">
            {emailVerified
              ? t("auth.login.verifySuccess")
              : resetSucceeded
                ? t("auth.login.resetSuccess")
                : t("auth.login.registerSuccess")}
          </p>
        ) : null}

        <AuthInput
          label={t("auth.fields.email")}
          name="email"
          type="email"
          placeholder={t("auth.placeholders.email")}
          icon={faEnvelope}
          error={errors.email?.message}
          registration={register("email")}
          autoComplete="email"
        />

        <AuthInput
          label={t("auth.fields.password")}
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={t("auth.placeholders.password")}
          icon={faLock}
          error={errors.password?.message}
          registration={register("password")}
          autoComplete="current-password"
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
        <div className="mt-2 text-end">
          <Link
            to="/forgot-password"
            className="text-xs font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
          >
            {t("auth.login.forgotPasswordLink")}
          </Link>
        </div>
      </div>

      {errors.root?.message ? (
        <p className="mt-4 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-start text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
          {errors.root.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
      >
        {isSubmitting ? t("auth.login.loading") : t("auth.login.submit")}
      </button>

      <OAuthButtons />

      <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
        >
          {t("auth.login.registerLink")}
        </Link>
      </p>

      <div className="mt-5 border-t border-red-900/10 pt-4 text-center text-xs font-bold text-neutral-400 dark:border-red-300/10">
        <FontAwesomeIcon
          icon={faShieldHalved}
          className="me-2 text-red-900 dark:text-red-200"
        />
        <span>{t("auth.securityNote")}</span>
      </div>
    </form>
  );
}

export default LoginPage;
