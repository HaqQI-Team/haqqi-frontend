import { useTranslation } from "react-i18next";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GoogleMark() {
  return (
    <span className="text-lg font-extrabold text-[#4285f4]" aria-hidden="true">
      G
    </span>
  );
}

function SocialAuthButtons() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        className="inline-flex h-12 items-center justify-center gap-3 rounded-[10px] border border-red-900/20 bg-white text-sm font-semibold text-neutral-800 transition duration-200 hover:-translate-y-0.5 hover:border-red-900/35 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-red-300/15 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-red-300/35"
      >
        <GoogleMark />
        <span>{t("auth.social.google")}</span>
      </button>

      <button
        type="button"
        className="inline-flex h-12 items-center justify-center gap-3 rounded-[10px] border border-red-900/20 bg-white text-sm font-semibold text-neutral-800 transition duration-200 hover:-translate-y-0.5 hover:border-red-900/35 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-red-300/15 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-red-300/35"
      >
        <FontAwesomeIcon icon={faMicrosoft} className="text-lg text-[#f25022]" />
        <span>{t("auth.social.microsoft")}</span>
      </button>
    </div>
  );
}

export default SocialAuthButtons;
