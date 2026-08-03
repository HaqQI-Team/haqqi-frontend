import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "../components/common/SectionHeading";
import { whyHaqqiItems } from "../data/landingData";

const easeOut = [0.22, 1, 0.36, 1];

function WhyHaqqiSection() {
  const { i18n, t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.dir() === "rtl";

  const leftInitialX = isRtl ? 24 : -24;
  const rightInitialX = isRtl ? -24 : 24;

  const panelTransition = {
    duration: shouldReduceMotion ? 0 : 0.55,
    ease: easeOut,
  };

  const leftVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: leftInitialX },
    visible: {
      opacity: 1,
      x: 0,
      transition: panelTransition,
    },
  };

  const rightVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: rightInitialX },
    visible: {
      opacity: 1,
      x: 0,
      transition: panelTransition,
    },
  };

  return (
    <section
      id="why-haqqi"
      className="overflow-hidden bg-white px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8 lg:py-20"
    >
      <SectionHeading
        title={t("whyHaqqi.title")}
        description={t("whyHaqqi.description")}
      />

      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-center"
      >
        <motion.div
          variants={leftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-4"
        >
          {whyHaqqiItems.map((item) => (
            <article
              key={item.titleKey}
              className="rounded-md border border-red-900/10 bg-[#fff8f4] p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900"
            >
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
                  <FontAwesomeIcon icon={item.icon} className="text-sm" />
                </span>

                <div>
                  <h3 className="text-base font-extrabold leading-6 text-neutral-950 dark:text-white">
                    {t(item.titleKey)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.article
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-[#fff7f4] p-6 text-start shadow-[0_18px_44px_rgba(127,29,29,0.08)] ring-1 ring-red-900/[0.04] dark:bg-neutral-900 dark:shadow-[0_18px_46px_rgba(0,0,0,0.28)] dark:ring-red-300/10 sm:p-8"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 w-1 bg-red-900 dark:bg-red-400 ${
              isRtl ? "right-0" : "left-0"
            }`}
          />

          <header className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className="text-lg text-red-900 dark:text-red-200"
            />

            <h3 className="text-lg font-extrabold leading-7 text-red-950 dark:text-red-100">
              {t("whyHaqqi.legalCard.title")}
            </h3>
          </header>

          <section
            aria-label={t("whyHaqqi.legalCard.explanationLabel")}
            className="mt-5"
          >
            <p className="text-lg italic leading-8 text-neutral-700 dark:text-neutral-200">
              {t("whyHaqqi.legalCard.explanationText")}
            </p>
          </section>

          <div className="my-5 h-px bg-red-900/15 dark:bg-red-300/15" />

          <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              <span>{t("whyHaqqi.legalCard.sourceLabel")}: </span>
              <span>{t("whyHaqqi.legalCard.sourceText")}</span>
            </p>

            <span className="inline-flex w-fit items-center rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-extrabold text-white dark:bg-emerald-600">
              {t("whyHaqqi.legalCard.badge")}
            </span>
          </footer>

          <p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            {t("whyHaqqi.legalCard.note")}
          </p>
        </motion.article>
      </div>
    </section>
  );
}

export default WhyHaqqiSection;
