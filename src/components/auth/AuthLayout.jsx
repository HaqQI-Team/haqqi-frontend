import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AuthPromoPanel from "./AuthPromoPanel";
import Link from "../../router/Link";

const authTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

function getIsDesktop() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(min-width: 1024px)").matches;
}

function AuthLayout({ mode, children }) {
  const { i18n, t } = useTranslation();
  const isLogin = mode === "login";
  const isRtl = i18n.dir() === "rtl";
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const formInitialX = isLogin ? 20 : -20;
  const formExitX = isLogin ? -12 : 12;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleChange(event) {
      setIsDesktop(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf7f5] dark:bg-neutral-950 lg:h-screen lg:max-h-screen lg:overflow-hidden">
      <LayoutGroup>
        <div className="relative grid min-h-screen w-full min-w-0 lg:h-screen lg:min-h-0 lg:max-h-screen lg:grid-cols-2 lg:overflow-hidden" dir="ltr">
          <AnimatePresence mode="wait">
            <motion.section
              key={mode}
              initial={{ opacity: 0, x: formInitialX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: formExitX }}
              transition={authTransition}
              dir={isRtl ? "rtl" : "ltr"}
              className={`flex min-w-0 items-center justify-center bg-[#fbf7f5] px-4 py-5 dark:bg-neutral-950 sm:px-6 lg:h-screen lg:min-h-0 lg:max-h-screen lg:px-8 lg:py-4 ${
                isLogin ? "lg:col-start-2" : "lg:col-start-1"
              }`}
            >
              <div
                className={`w-full min-w-0 ${
                  isLogin ? "max-w-[440px] lg:max-w-[420px]" : "max-w-[560px]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between lg:hidden">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md py-1.5 text-sm font-bold text-neutral-600 transition hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800 dark:text-neutral-300 dark:hover:text-red-200"
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className={isRtl ? "rotate-180" : ""}
                    />
                    <span>{t("auth.backToHome")}</span>
                  </Link>
                </div>
                {children}
              </div>
            </motion.section>
          </AnimatePresence>

          <AuthPromoPanel
            isRtl={isRtl}
            animateX={isDesktop && !isLogin ? "100%" : "0%"}
          />
        </div>
      </LayoutGroup>
    </main>
  );
}

export default AuthLayout;
