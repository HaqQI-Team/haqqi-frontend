import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/auth/AuthInput";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import Link from "../router/Link";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const { i18n, t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
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

    if (!formData.fullName.trim()) {
      nextErrors.fullName = t("auth.validation.fullNameRequired");
    }

    if (!formData.email.trim()) {
      nextErrors.email = t("auth.validation.emailRequired");
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = t("auth.validation.emailInvalid");
    }

    if (formData.password.length < 8) {
      nextErrors.password = t("auth.validation.passwordMin");
    }

    if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = t("auth.validation.passwordMatch");
    }

    if (!formData.acceptedTerms) {
      nextErrors.acceptedTerms = t("auth.validation.termsRequired");
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

  function renderPasswordButton(isVisible, toggleVisibility) {
    const label = isVisible
      ? t("auth.actions.hidePassword")
      : t("auth.actions.showPassword");

    return (
      <button
        type="button"
        aria-label={label}
        onClick={toggleVisibility}
        className="rounded-md p-1 text-neutral-500 transition hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-neutral-300 dark:hover:text-red-200"
      >
        <FontAwesomeIcon icon={isVisible ? faEyeSlash : faEye} />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="text-start">
        <div className="mb-5 lg:mb-4">
          <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
            {t("auth.register.title")}
          </h1>
          <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
            {t("auth.register.subtitle")}
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

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          <AuthInput
            label={t("auth.fields.fullName")}
            name="fullName"
            type="text"
            value={formData.fullName}
            placeholder={t("auth.placeholders.fullName")}
            icon={faUser}
            error={errors.fullName}
            onChange={handleChange}
            autoComplete="name"
          />

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

          <AuthInput
            label={t("auth.fields.password")}
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            placeholder={t("auth.placeholders.password")}
            icon={faLock}
            error={errors.password}
            onChange={handleChange}
            autoComplete="new-password"
            rightButton={renderPasswordButton(showPassword, () =>
              setShowPassword((current) => !current),
            )}
          />

          <AuthInput
            label={t("auth.fields.confirmPassword")}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            placeholder={t("auth.placeholders.password")}
            icon={faLock}
            error={errors.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            rightButton={renderPasswordButton(showConfirmPassword, () =>
              setShowConfirmPassword((current) => !current),
            )}
          />

          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-start text-sm leading-5 text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                aria-invalid={errors.acceptedTerms ? "true" : "false"}
                aria-describedby={errors.acceptedTerms ? "acceptedTerms-error" : undefined}
                className="mt-0.5 h-4 w-4 rounded border-red-900/20 text-red-900 focus:ring-red-900 dark:border-red-300/20 dark:bg-neutral-950"
              />
              <span>
                {t("auth.register.termsPrefix")}{" "}
                <a
                  href="#terms"
                  className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200"
                >
                  {t("auth.register.terms")}
                </a>{" "}
                {t("auth.register.and")}{" "}
                <a
                  href="#privacy"
                  className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200"
                >
                  {t("auth.register.privacy")}
                </a>
              </span>
            </label>
            {errors.acceptedTerms ? (
              <p id="acceptedTerms-error" className="mt-2 text-start text-xs font-semibold text-red-700 dark:text-red-300">
                {errors.acceptedTerms}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
        >
          <span>{t("auth.register.submit")}</span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className={i18n.dir() === "rtl" ? "rotate-180" : ""}
          />
        </button>

        <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
          {t("auth.register.hasAccount")}{" "}
          <Link
            to="/login"
            className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
          >
            {t("auth.register.signInLink")}
          </Link>
        </p>

        <div className="mt-5 border-t border-red-900/10 pt-4 text-center text-xs font-bold text-neutral-400 dark:border-red-300/10">
          <FontAwesomeIcon icon={faShieldHalved} className="me-2 text-red-900 dark:text-red-200" />
          <span>{t("auth.securityNote")}</span>
        </div>
    </form>
  );
}

export default RegisterPage;
