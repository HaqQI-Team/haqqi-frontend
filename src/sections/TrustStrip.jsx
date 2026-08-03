import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { trustItems } from "../data/landingData";

function TrustStrip() {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t("trustStrip.label")}
      className="border-y border-red-900/10 bg-white/95 px-4 py-5 dark:border-red-300/10 dark:bg-neutral-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <p
            key={item.labelKey}
            className="flex items-center justify-center gap-2 rounded-md bg-red-50/45 px-3 py-2.5 text-center text-xs font-bold text-red-950 ring-1 ring-red-900/5 dark:bg-red-950/15 dark:text-red-100 dark:ring-red-300/10 sm:text-sm"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-[0.78rem] text-red-900/65 dark:text-red-200/70"
            />
            <span>{t(item.labelKey)}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export default TrustStrip;
