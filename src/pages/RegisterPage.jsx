import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faAt,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faPhone,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/auth/AuthInput";
import Link from "../router/Link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import { storePendingVerificationEmail } from "../utils/emailVerification";
import { getLanguagePreference } from "../utils/languagePreference";
import { createRegisterSchema } from "../validation/authSchemas";

function getRegisterErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");
  const normalizedMessage = message.toLowerCase();

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (status === 409 && normalizedMessage.includes("already registered")) {
    return t("auth.errors.accountExists");
  }

  if (message) {
    return message;
  }

  return t(`auth.errors.status.${status}`, {
    defaultValue: t("auth.errors.registerFailed"),
  });
}

function RegisterPage() {
  const { i18n, t } = useTranslation();
  const { register: registerUser } = useAuth();
  const { navigate } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      acceptedTerms: false,
    },
  });

  async function onSubmit(formData) {
    clearErrors("root");

    const { acceptedTerms, confirmPassword, ...registrationData } = formData;

    void acceptedTerms;
    void confirmPassword;

    try {
      await registerUser({
        ...registrationData,
        pref_Language: getLanguagePreference(i18n.resolvedLanguage || i18n.language),
      });
      storePendingVerificationEmail(registrationData.email);
      navigate("/verify-email");
    } catch (error) {
      setError("root", {
        message: getRegisterErrorMessage(error, t),
      });
    }
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="text-start">
        <div className="mb-5 lg:mb-4">
          <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
            {t("auth.register.title")}
          </h1>
          <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
            {t("auth.register.subtitle")}
          </p>
        </div>

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          <AuthInput
            label={t("auth.fields.name")}
            name="name"
            type="text"
            placeholder={t("auth.placeholders.name")}
            icon={faUser}
            error={errors.name?.message}
            registration={register("name")}
            autoComplete="name"
          />

          <AuthInput
            label={t("auth.fields.username")}
            name="username"
            type="text"
            placeholder={t("auth.placeholders.username")}
            icon={faAt}
            error={errors.username?.message}
            registration={register("username")}
            autoComplete="username"
          />

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
            label={t("auth.fields.phoneNumber")}
            name="phoneNumber"
            type="tel"
            placeholder={t("auth.placeholders.phoneNumber")}
            icon={faPhone}
            error={errors.phoneNumber?.message}
            registration={register("phoneNumber")}
            autoComplete="tel"
          />

          <AuthInput
            label={t("auth.fields.password")}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.placeholders.password")}
            icon={faLock}
            error={errors.password?.message}
            registration={register("password")}
            autoComplete="new-password"
            rightButton={renderPasswordButton(showPassword, () =>
              setShowPassword((current) => !current),
            )}
          />

          <AuthInput
            label={t("auth.fields.confirmPassword")}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.placeholders.password")}
            icon={faLock}
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
            autoComplete="new-password"
            rightButton={renderPasswordButton(showConfirmPassword, () =>
              setShowConfirmPassword((current) => !current),
            )}
          />

          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-start text-sm leading-5 text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                {...register("acceptedTerms")}
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
                {errors.acceptedTerms.message}
              </p>
            ) : null}
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
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:text-base"
        >
          <span>
            {isSubmitting ? t("auth.register.loading") : t("auth.register.submit")}
          </span>
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
