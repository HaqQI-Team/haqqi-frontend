import { useTranslation } from "react-i18next";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-lg font-bold">
            <FontAwesomeIcon icon={faScaleBalanced} />
            <span>{t("brand.name")}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-300">
            {t("footer.description")}
          </p>
        </div>
        <p className="text-sm text-neutral-400">{t("footer.location")}</p>
      </div>
    </footer>
  );
}

export default Footer;
