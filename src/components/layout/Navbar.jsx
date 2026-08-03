import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  faBars,
  faScaleBalanced,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LanguageToggle from "../common/LanguageToggle";
import ThemeToggle from "../common/ThemeToggle";
import Link from "../../router/Link";

const navItems = [
  { id: "home", labelKey: "navigation.home" },
  { id: "how-it-works", labelKey: "navigation.howItWorks" },
  { id: "features", labelKey: "navigation.features" },
  { id: "why-haqqi", labelKey: "navigation.whyHaqqi" },
  { id: "workflow", labelKey: "navigation.workflow" },
  { id: "problems", labelKey: "navigation.problems" },
  { id: "faq", labelKey: "navigation.faq" },
];

function NavLink({ item, children, onSelect, isActive = false, isRtl = false }) {
  return (
    <a
      href={`#${item.id}`}
      onClick={(event) => onSelect(event, item.id)}
      className={`group relative inline-flex min-h-9 items-center text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 dark:focus-visible:outline-red-300 ${
        isActive
          ? "text-red-900 dark:text-red-200"
          : "text-neutral-600 hover:text-red-900 dark:text-neutral-300 dark:hover:text-red-200"
      }`}
    >
      <span>{children}</span>
      <span
        className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-red-900 transition-transform duration-300 dark:bg-red-300 ${
          isRtl ? "origin-right" : "origin-left"
        } ${isActive ? "scale-x-100" : "scale-x-0"}`}
        aria-hidden="true"
      />
    </a>
  );
}

function Navbar() {
  const { i18n, t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    sections.forEach((section) => {
      section.style.scrollMarginTop = "6rem";
    });

    function updateActiveSection() {
      if (window.scrollY < 120) {
        setActiveSection("home");
        return;
      }

      const activationPoint = window.innerHeight * 0.25;
      const visibleSections = sections
        .filter((section) => {
          const rect = section.getBoundingClientRect();

          return rect.bottom > 0 && rect.top < window.innerHeight;
        })
        .map((section) => ({
          id: section.id,
          distance: Math.abs(
            section.getBoundingClientRect().top - activationPoint,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].id);
      }
    }

    const observer = new IntersectionObserver(
      () => updateActiveSection(),
      {
        root: null,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleNavSelect(event, sectionId) {
    event.preventDefault();
    setActiveSection(sectionId);
    closeMenu();

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <motion.header
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-red-950/10 bg-[#fbf7f5]/95 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label={t("navigation.mainLabel")}
      >
        <a
          href="#home"
          onClick={(event) => handleNavSelect(event, "home")}
          className="inline-flex items-center gap-2 text-base font-extrabold text-red-900 transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 dark:text-red-200 dark:focus-visible:outline-red-300"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-900 text-sm text-white dark:bg-red-700">
            <FontAwesomeIcon icon={faScaleBalanced} />
          </span>
          <span>{t("brand.name")}</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              onSelect={handleNavSelect}
              isActive={activeSection === item.id}
              isRtl={isRtl}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">
            <LanguageToggle compact />
          </div>
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 md:inline-flex dark:text-neutral-200 dark:hover:text-red-200 dark:focus-visible:outline-red-300"
          >
            {t("navigation.signIn")}
          </Link>
          <Link
            to="/register"
            className="hidden rounded-md bg-red-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 md:inline-flex dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:outline-red-300"
          >
            {t("navigation.signUp")}
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-800 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-300 dark:focus-visible:outline-red-300 lg:hidden"
            aria-label={
              isMenuOpen ? t("navigation.closeMenu") : t("navigation.openMenu")
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="border-t border-red-950/10 bg-[#fbf7f5] px-4 py-4 shadow-sm dark:border-white/10 dark:bg-neutral-950 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              <div className="flex items-center gap-2 sm:hidden">
                <LanguageToggle />
              </div>
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  onSelect={handleNavSelect}
                  isActive={activeSection === item.id}
                  isRtl={isRtl}
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-md border border-neutral-200 px-4 py-2 text-center text-sm font-semibold text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200 dark:focus-visible:outline-red-300"
                >
                  {t("navigation.signIn")}
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-md bg-red-900 px-4 py-2 text-center text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:outline-red-300"
                >
                  {t("navigation.signUp")}
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
