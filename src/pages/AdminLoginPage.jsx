import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faScaleBalanced,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/auth/AuthInput";
import ThemeToggle from "../components/common/ThemeToggle";
import LanguageToggle from "../components/common/LanguageToggle";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import { applyApiFieldErrors } from "../utils/formErrors";
import { createLoginSchema } from "../validation/authSchemas";

function getAdminLoginErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (message) {
    return message;
  }

  return t(`auth.errors.status.${status}`, {
    defaultValue: t("auth.errors.loginFailed"),
  });
}

function AdminLoginPage() {
  const { i18n, t } = useTranslation();
  const { isAdmin, isAuthenticated, isLoading, login, logout } = useAuth();
  const { navigate } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, isAuthenticated, isLoading, navigate]);

  async function onSubmit(formData) {
    clearErrors("root");

    try {
      const authResult = await login(formData);

      if (authResult?.isAdmin) {
        navigate("/admin/dashboard");
        return;
      }

      logout();
      setError("root", {
        message: t("admin.auth.permissionDenied"),
      });
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(error, setError, [
        "email",
        "password",
      ]);

      if (!hasFieldErrors) {
        setError("root", {
          message: getAdminLoginErrorMessage(error, t),
        });
      }
    }
  }

  const passwordToggleLabel = showPassword
    ? t("auth.actions.hidePassword")
    : t("auth.actions.showPassword");

  return (
    <main
      dir={i18n.dir()}
      className="min-h-screen bg-[#fbf7f5] px-4 py-6 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 text-lg font-extrabold text-red-900 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 dark:text-red-200"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
              <FontAwesomeIcon icon={faScaleBalanced} />
            </span>
            <span>{t("admin.brand")}</span>
          </button>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1fr_28rem]">
          <div className="max-w-2xl text-start">
            <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
              {t("admin.auth.eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-5xl">
              {t("admin.auth.title")}
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
              {t("admin.auth.description")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-6"
          >
            <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white">
              {t("admin.auth.loginTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("admin.auth.loginDescription")}
            </p>

            {isAuthenticated && !isAdmin ? (
              <div className="mt-5 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
                <p>{t("admin.auth.permissionDenied")}</p>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 rounded-md bg-red-900 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  {t("admin.signOut")}
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-3">
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
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    }
                  />
                </div>

                {errors.root?.message ? (
                  <p className="mt-4 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-start text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
                    {errors.root.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
                >
                  {isSubmitting
                    ? t("admin.auth.signingIn")
                    : t("admin.auth.signIn")}
                </button>
              </>
            )}

            <div className="mt-5 border-t border-red-900/10 pt-4 text-center text-xs font-bold text-neutral-400 dark:border-red-300/10">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="me-2 text-red-900 dark:text-red-200"
              />
              <span>{t("auth.securityNote")}</span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AdminLoginPage;
