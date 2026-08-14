import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faKey,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { verifyEmail } from "../api/authApi";
import AuthInput from "../components/auth/AuthInput";
import Link from "../router/Link";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import {
  clearPendingVerificationEmail,
  getPendingVerificationEmail,
} from "../utils/emailVerification";
import { createVerifyEmailSchema } from "../validation/authSchemas";

function getVerifyEmailErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (status === 400) {
    return message || t("auth.errors.invalidOtp");
  }

  if (status === 404) {
    return message || t("auth.errors.verificationUserNotFound");
  }

  if (message) {
    return message;
  }

  return t(`auth.errors.status.${status}`, {
    defaultValue: t("auth.errors.verificationFailed"),
  });
}

function VerifyEmailPage() {
  const { i18n, t } = useTranslation();
  const { navigate } = useRouter();
  const pendingEmail = getPendingVerificationEmail();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createVerifyEmailSchema(t)),
    defaultValues: {
      email: pendingEmail,
      otp: "",
    },
  });

  async function onSubmit(formData) {
    clearErrors("root");

    try {
      await verifyEmail({
        email: formData.email,
        otp: formData.otp,
      });
      clearPendingVerificationEmail();
      navigate("/login?verified=1");
    } catch (error) {
      setError("root", {
        message: getVerifyEmailErrorMessage(error, t),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="text-start">
      <div className="mb-5 lg:mb-4">
        <h1 className="text-3xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-[2rem]">
          {t("auth.verify.title")}
        </h1>
        <p className="mt-1.5 text-sm leading-5 text-neutral-600 dark:text-neutral-300">
          {t("auth.verify.subtitle")}
        </p>
      </div>

      {pendingEmail ? (
        <div className="mb-4 rounded-md border border-red-900/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-red-300/10 dark:bg-neutral-900 dark:text-neutral-300">
          <p>{t("auth.verify.sentTo")}</p>
          <a
            href={`mailto:${pendingEmail}`}
            className="mt-1 inline-block break-words font-extrabold text-red-900 dark:text-red-200"
          >
            {pendingEmail}
          </a>
          <input type="hidden" {...register("email")} />
          {errors.email?.message ? (
            <p className="mt-2 text-xs font-semibold text-red-700 dark:text-red-300">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mb-3">
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
        </div>
      )}

      <AuthInput
        label={t("auth.fields.otp")}
        name="otp"
        type="text"
        placeholder={t("auth.placeholders.otp")}
        icon={faKey}
        error={errors.otp?.message}
        registration={register("otp")}
        autoComplete="one-time-code"
      />

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
          {isSubmitting ? t("auth.verify.loading") : t("auth.verify.submit")}
        </span>
        <FontAwesomeIcon
          icon={faArrowRight}
          className={i18n.dir() === "rtl" ? "rotate-180" : ""}
        />
      </button>

      <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
        {t("auth.verify.haveAccount")}{" "}
        <Link
          to="/login"
          className="font-bold text-red-900 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
        >
          {t("auth.verify.signInLink")}
        </Link>
      </p>

      <div className="mt-5 border-t border-red-900/10 pt-4 text-center text-xs font-bold text-neutral-400 dark:border-red-300/10">
        <FontAwesomeIcon icon={faShieldHalved} className="me-2 text-red-900 dark:text-red-200" />
        <span>{t("auth.securityNote")}</span>
      </div>
    </form>
  );
}

export default VerifyEmailPage;
