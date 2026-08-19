import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { API_BASE_URL } from "../../api/apiClient";

function OAuthButtons({ mode = "login" }) {
  const { t } = useTranslation();
  const isSignUp = mode === "signup" || mode === "register";

  const googleLabel = isSignUp
    ? t("auth.register.googleSignUp", { defaultValue: "Sign up with Google" })
    : t("auth.login.googleSignIn", { defaultValue: "Sign in with Google" });

  const microsoftLabel = isSignUp
    ? t("auth.register.microsoftSignUp", { defaultValue: "Sign up with Microsoft" })
    : t("auth.login.microsoftSignIn", { defaultValue: "Sign in with Microsoft" });

  if (isSignUp) {
    return (
      <>
        <div className="mt-4 flex items-center justify-between gap-3">
          <hr className="w-full border-neutral-200 dark:border-neutral-800" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {t("auth.login.or", { defaultValue: "Or" })}
          </span>
          <hr className="w-full border-neutral-200 dark:border-neutral-800" />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              window.location.href = `${API_BASE_URL}/api/User/login/google`;
            }}
            className="inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:text-base cursor-pointer"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-950 dark:text-white" />
            <span>{googleLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = `${API_BASE_URL}/api/User/login/microsoft`;
            }}
            className="inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:text-base cursor-pointer"
          >
            <FontAwesomeIcon icon={faMicrosoft} className="text-red-950 dark:text-white" />
            <span>{microsoftLabel}</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3">
        <hr className="w-full border-neutral-200 dark:border-neutral-800" />
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {t("auth.login.or", { defaultValue: "Or" })}
        </span>
        <hr className="w-full border-neutral-200 dark:border-neutral-800" />
      </div>

      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_BASE_URL}/api/User/login/google`;
        }}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:text-base cursor-pointer"
      >
        <FontAwesomeIcon icon={faGoogle} className="text-red-950 dark:text-white" />
        <span>{googleLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_BASE_URL}/api/User/login/microsoft`;
        }}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:text-base cursor-pointer"
      >
        <FontAwesomeIcon icon={faMicrosoft} className="text-red-950 dark:text-white" />
        <span>{microsoftLabel}</span>
      </button>
    </>
  );
}

export default OAuthButtons;
