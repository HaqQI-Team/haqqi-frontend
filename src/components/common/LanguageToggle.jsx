import { useTranslation } from "react-i18next";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LanguageToggle({ compact = false }) {
  const { i18n, t } = useTranslation();
  const nextLanguage = i18n.language === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-bold text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-800 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-300 dark:focus-visible:outline-red-300"
      aria-label={t("controls.languageLabel", {
        language: t(`language.names.${nextLanguage}`),
      })}
      title={t("controls.languageLabel", {
        language: t(`language.names.${nextLanguage}`),
      })}
    >
      <FontAwesomeIcon icon={faGlobe} />
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>
        {t("controls.languageButton")}
      </span>
    </button>
  );
}

export default LanguageToggle;
