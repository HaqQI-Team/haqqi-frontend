import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { features } from "../data/landingData";

const easeOut = [0.22, 1, 0.36, 1];

function FeaturesSection() {
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
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.42,
        ease: easeOut,
      },
    },
  };

  const iconVariants = {
    hidden: shouldReduceMotion ? { scale: 1 } : { scale: 0.9 },
    visible: {
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.42,
        ease: easeOut,
      },
    },
  };

  return (
    <section
      id="features"
      className="bg-[#fff8f4] px-4 py-16 dark:bg-[#130f10] sm:px-6 lg:px-8 lg:py-20"
    >
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeading
          title={t("features.title")}
          description={t("features.description")}
        />
      </motion.div>

      <motion.div
        dir={isRtl ? "rtl" : "ltr"}
        variants={cardsVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.article
            key={feature.titleKey}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
            className="group rounded-md border border-red-900/10 bg-white/90 p-5 text-start shadow-sm transition-colors duration-200 hover:border-red-900/25 hover:shadow-[0_14px_34px_rgba(127,29,29,0.11)] dark:border-red-300/10 dark:bg-neutral-950/80 dark:hover:border-red-300/30 dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
          >
            <motion.span
              variants={iconVariants}
              className="grid h-10 w-10 place-items-center rounded-md bg-red-900/[0.08] text-red-900 transition-colors duration-200 group-hover:bg-red-900/[0.13] dark:bg-red-300/10 dark:text-red-200 dark:group-hover:bg-red-300/15"
            >
              <FontAwesomeIcon icon={feature.icon} className="text-sm" />
            </motion.span>

            <h3 className="mt-5 text-base font-extrabold leading-6 text-neutral-950 dark:text-white">
              {t(feature.titleKey)}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t(feature.descriptionKey)}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default FeaturesSection;
