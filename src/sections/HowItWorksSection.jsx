import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { howItWorksSteps } from "../data/landingData";

const easeOut = [0.22, 1, 0.36, 1];

function HowItWorksSection() {
  const { i18n, t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.dir() === "rtl";

  const headingVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: easeOut,
      },
    },
  };

  const cardsVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: easeOut,
      },
    },
  };

  return (
    <section
      id="how-it-works"
      className="bg-[#fbf7f5] px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8 lg:py-20"
    >
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeading
          title={t("howItWorks.title")}
          description={t("howItWorks.description")}
        />
      </motion.div>

      <motion.div
        dir={isRtl ? "rtl" : "ltr"}
        variants={cardsVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {howItWorksSteps.map((step, index) => (
          <motion.article
            key={step.titleKey}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
            className="group relative flex min-h-52 flex-col rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm transition-colors duration-200 hover:border-red-900/30 hover:shadow-[0_16px_38px_rgba(127,29,29,0.12)] dark:border-red-300/10 dark:bg-neutral-900 dark:hover:border-red-300/35 dark:hover:shadow-[0_16px_38px_rgba(0,0,0,0.32)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 transition-colors duration-200 group-hover:bg-red-900/[0.13] dark:bg-red-300/10 dark:text-red-200 dark:group-hover:bg-red-300/15">
                <FontAwesomeIcon icon={step.icon} className="text-sm" />
              </span>

              <span className="text-xs font-bold text-red-900/45 dark:text-red-200/45">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-5 text-base font-extrabold leading-6 text-neutral-950 dark:text-white">
              {t(step.titleKey)}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t(step.descriptionKey)}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default HowItWorksSection;
