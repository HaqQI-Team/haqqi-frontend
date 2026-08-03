import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import {
  faArrowLeft,
  faArrowRight,
  faBrain,
  faLock,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const easeOut = [0.22, 1, 0.36, 1];
const trustIcons = [faScaleBalanced, faBrain, faLock];

function HeroSection({ onProtectedAction }) {
  const { i18n, t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const isRtl = i18n.dir() === "rtl";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const childVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: easeOut,
      },
    },
  };

const imageInitial = shouldReduceMotion
  ? {
      opacity: 1,
      x: 0,
      scale: 1,
    }
  : {
      opacity: 0,
      x: isRtl ? -180 : 180,
      scale: 1.04,
    };

  const arrowIcon = isRtl ? faArrowLeft : faArrowRight;

  const arrowHoverClass = isRtl
    ? "group-hover:-translate-x-1"
    : "group-hover:translate-x-1";

  const trustPoints = t("hero.trustPoints", {
    returnObjects: true,
  });

  return (
    <section
      id="home"
      className="
        relative
        min-h-[calc(100vh-62px)]
        scroll-mt-24
        overflow-hidden
        bg-[#fbf7f5]
        dark:bg-neutral-950
      "
    >
      {/* Background image */}
      <motion.div
        key={`hero-image-${i18n.resolvedLanguage}`}
        aria-hidden="true"
        initial={imageInitial}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.9,
          ease: easeOut,
        }}
        className={`
          absolute inset-0

          lg:inset-y-0
          lg:w-[58%]

          ${
            isRtl
              ? "lg:left-0 lg:right-auto"
              : "lg:left-auto lg:right-0"
          }
        `}
      >
{/* Light mode image */}
<img
  src="/images/hero-section.png"
  alt=""
  className={`
    block
    h-full
    w-full
    object-cover
    object-[68%_center]
    dark:hidden
    lg:object-center
    ${isRtl ? "scale-x-[-1]" : ""}
  `}
/>

{/* Dark mode image */}
<img
  src="/images/hero-darkSection.png"
  alt=""
  className={`
    hidden
    h-full
    w-full
    object-cover
    object-[68%_center]
    dark:block
    lg:object-center
    ${isRtl ? "scale-x-[-1]" : ""}
  `}
/>

        {/* Mobile/tablet overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[rgba(251,247,245,0.66)]
            dark:bg-[rgba(10,10,10,0.62)]
            lg:hidden
          "
        />

        {/* Desktop blend */}
        <div
          className={`
            absolute inset-0 hidden lg:block

            ${
              isRtl
                ? `
                  bg-gradient-to-l
                  from-[#fbf7f5]
                  from-0%
                  via-[rgba(251,247,245,0.30)]
                  via-30%
                  to-transparent
                  to-70%

                  dark:from-neutral-950
                  dark:via-[rgba(10,10,10,0.26)]
                  dark:to-transparent
                `
                : `
                  bg-gradient-to-r
                  from-[#fbf7f5]
                  from-0%
                  via-[rgba(251,247,245,0.30)]
                  via-30%
                  to-transparent
                  to-70%

                  dark:from-neutral-950
                  dark:via-[rgba(10,10,10,0.26)]
                  dark:to-transparent
                `
            }
          `}
        />
      </motion.div>

      {/* Keep the physical page layout LTR */}
      <div
        dir="ltr"
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-62px)]
          max-w-7xl
          items-center
          px-4
          py-20
          sm:px-6
          lg:px-8
        "
      >
        <motion.div
          key={`hero-content-${i18n.resolvedLanguage}`}
          dir={isRtl ? "rtl" : "ltr"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`
            w-full
            max-w-2xl
            text-center

            lg:w-[46%]
            lg:max-w-none

            ${
              isRtl
                ? "lg:ml-auto lg:mr-0 lg:text-right"
                : "lg:ml-0 lg:mr-auto lg:text-left"
            }
          `}
        >
          <motion.p
            variants={childVariants}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-red-900/10
              bg-white/90
              px-3
              py-1.5
              text-xs
              font-bold
              text-red-900
              shadow-sm
              backdrop-blur-sm

              dark:border-red-300/20
              dark:bg-neutral-900/90
              dark:text-red-200
            "
          >
            <FontAwesomeIcon icon={faScaleBalanced} />

            <span>{t("hero.eyebrow")}</span>
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="
              mt-6
              text-4xl
              font-extrabold
              leading-tight
              text-neutral-950

              dark:text-white

              sm:text-5xl
              lg:text-6xl
            "
          >
            <span className="block">
              {t("hero.headingLineOne")}
            </span>

            <span className="block text-red-900 dark:text-red-300">
              {t("hero.headingLineTwo")}
            </span>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className={`
              mx-auto
              mt-5
              max-w-xl
              text-base
              leading-7
              text-neutral-600

              dark:text-neutral-300

              ${
                isRtl
                  ? "lg:ml-auto lg:mr-0"
                  : "lg:ml-0 lg:mr-auto"
              }
            `}
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={childVariants}
            className={`
              mt-8
              flex
              flex-col
              justify-center
              gap-3

              sm:flex-row
              sm:flex-wrap

              ${
                isRtl
                  ? "lg:justify-start"
                  : "lg:justify-start"
              }
            `}
          >
            <button
              type="button"
              onClick={() => onProtectedAction("/complaints/new")}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-md
                bg-red-900
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                duration-200

                hover:-translate-y-0.5
                hover:bg-red-800

                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-red-900

                dark:bg-red-700
                dark:hover:bg-red-600
                dark:focus-visible:outline-red-300
              "
            >
              <span>{t("hero.actions.start")}</span>

              <FontAwesomeIcon
                icon={arrowIcon}
                className={`
                  transition-transform
                  duration-200
                  ${arrowHoverClass}
                `}
              />
            </button>

            <a
              href="#how-it-works"
              className="
                inline-flex
                items-center
                justify-center
                rounded-md
                border
                border-red-900/20
                bg-white/90
                px-5
                py-3
                text-sm
                font-bold
                text-red-900
                backdrop-blur-sm
                transition
                duration-200

                hover:-translate-y-0.5
                hover:border-red-900/40
                hover:bg-red-50

                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-red-900

                dark:border-red-300/30
                dark:bg-neutral-900/90
                dark:text-red-200
                dark:hover:border-red-300/60
                dark:hover:bg-neutral-800
                dark:focus-visible:outline-red-300
              "
            >
              {t("hero.actions.learn")}
            </a>
          </motion.div>

          <motion.ul
            variants={childVariants}
            aria-label={t("hero.trustLabel")}
            className="
              mt-8
              flex
              flex-wrap
              justify-center
              gap-3
              text-sm
              font-semibold
              text-neutral-700

              dark:text-neutral-200

              lg:justify-start
            "
          >
            {Array.isArray(trustPoints) &&
              trustPoints.map((trustPoint, index) => (
                <li
                  key={trustPoint}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/90
                    px-3
                    py-2
                    shadow-sm
                    ring-1
                    ring-red-900/10
                    backdrop-blur-sm

                    dark:bg-neutral-900/90
                    dark:ring-red-300/15
                  "
                >
                  <FontAwesomeIcon
                    icon={trustIcons[index]}
                    className="text-red-900 dark:text-red-300"
                  />

                  <span>{trustPoint}</span>
                </li>
              ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
