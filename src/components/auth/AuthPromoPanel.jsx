import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBolt,
  faFileLines,
  faScaleBalanced,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import Link from "../../router/Link";

const promoFeatures = [
  {
    icon: faBolt,
    titleKey: "auth.promo.features.analysis.title",
    descriptionKey: "auth.promo.features.analysis.description",
  },
  {
    icon: faFileLines,
    titleKey: "auth.promo.features.drafting.title",
    descriptionKey: "auth.promo.features.drafting.description",
  },
  {
    icon: faShieldHalved,
    titleKey: "auth.promo.features.security.title",
    descriptionKey: "auth.promo.features.security.description",
  },
];

const authTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

function AuthPromoPanel({ animateX = "0%", isRtl = false }) {
  const { t } = useTranslation();

  return (
    <motion.aside
      layout
      animate={{ x: animateX }}
      transition={authTransition}
      dir={isRtl ? "rtl" : "ltr"}
      className="flex min-h-[360px] min-w-0 flex-col bg-[#2b1719] p-6 text-white sm:p-8 lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:h-screen lg:min-h-0 lg:max-h-screen lg:w-1/2 lg:p-8"
    >
      <div className="flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-3 text-lg font-extrabold">
          <FontAwesomeIcon icon={faScaleBalanced} />
          <span>{t("brand.name")}</span>
        </div>
        <Link
          to="/"
          className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white lg:inline-flex"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className={isRtl ? "rotate-180" : ""}
          />
          <span>{t("auth.backToHome")}</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center py-8 text-center lg:py-5">
        <h2 className="max-w-[420px] text-2xl font-extrabold leading-tight sm:text-3xl">
          {t("auth.promo.title")}
        </h2>
      </div>

      <div className="border-t border-white/12 pt-5">
        <ul className="space-y-3">
          {promoFeatures.map((feature) => (
            <li key={feature.titleKey} className="flex gap-3 text-start">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-red-200">
                <FontAwesomeIcon icon={feature.icon} />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-white">
                  {t(feature.titleKey)}
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-white/58">
                  {t(feature.descriptionKey)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}

export default AuthPromoPanel;
