import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/auth/AuthInput";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import Link from "../router/Link";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  function handleChange(event) {
    const { checked, name, type, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = t("auth.validation.emailRequired");
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = t("auth.validation.emailInvalid");
    }

    if (!formData.password) {
      nextErrors.password = t("auth.validation.passwordRequired");
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: replace with API request later
    console.log(formData);
  }

  const passwordToggleLabel = showPassword
    ? t("auth.actions.hidePassword")
    : t("auth.actions.showPassword");

  return (
    <form onSubmit={handleSubmit} noValidate className="text-start">
        <div className="mb-5 lg:mb-4">
          <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
            {t("auth.login.title")}
          </h1>
          <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <SocialAuthButtons />

        <div className="my-5 flex items-center gap-4 lg:my-4">
          <span className="h-px flex-1 bg-red-900/14 dark:bg-red-300/12" />
          <span className="text-xs font-extrabold uppercase text-neutral-400">
            {t("auth.divider")}
          </span>
          <span className="h-px flex-1 bg-red-900/14 dark:bg-red-300/12" />
        </div>

        <div className="space-y-3">
          <AuthInput
            label={t("auth.fields.email")}
            name="email"
            type="email"
            value={formData.email}
            placeholder={t("auth.placeholders.email")}
            icon={faEnvelope}
            error={errors.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {t("auth.fields.password")}
              </label>
              <a
                href="#forgot-password"
                className="text-sm font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
              >
                {t("auth.login.forgotPassword")}
              </a>
            </div>

            <AuthInput
              label=""
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder={t("auth.placeholders.password")}
              icon={faLock}
              error={errors.password}
              onChange={handleChange}
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
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-start text-sm text-neutral-600 dark:text-neutral-300">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-red-900/20 text-red-900 focus:ring-red-900 dark:border-red-300/20 dark:bg-neutral-950"
            />
            <span>{t("auth.login.rememberMe")}</span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
        >
          {t("auth.login.submit")}
        </button>

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
          <FontAwesomeIcon icon={faShieldHalved} className="me-2 text-red-900 dark:text-red-200" />
          <span>{t("auth.securityNote")}</span>
        </div>
    </form>
  );
}

export default LoginPage;
