import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "../../router/useRouter";

const authModalTransition = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1],
};

function AuthRequiredModal({ isOpen, onClose }) {
  const { i18n, t } = useTranslation();
  const { navigate } = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const primaryButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  function handleNavigate(path) {
    onClose();
    navigate(path);
  }

  const backdropMotion = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const dialogMotion = shouldReduceMotion
    ? {
        initial: { opacity: 1, y: 0, scale: 1 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 1, y: 0, scale: 1 },
      }
    : {
        initial: { opacity: 0, y: 18, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
          {...backdropMotion}
          transition={authModalTransition}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-required-title"
            aria-describedby="auth-required-description"
            dir={isRtl ? "rtl" : "ltr"}
            className="relative w-[calc(100%-2rem)] max-w-md rounded-2xl border border-red-900/10 bg-[#fffaf7] p-6 text-start text-neutral-950 shadow-2xl dark:border-white/10 dark:bg-neutral-900 dark:text-white sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
            {...dialogMotion}
            transition={authModalTransition}
          >
            <button
              type="button"
              aria-label={t("authRequired.close")}
              onClick={onClose}
              className={`absolute top-4 grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition hover:bg-red-900/8 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white ${
                isRtl ? "left-4" : "right-4"
              }`}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className={isRtl ? "pl-9" : "pr-9"}>
              <h2
                id="auth-required-title"
                className="text-2xl font-extrabold leading-tight"
              >
                {t("authRequired.title")}
              </h2>
              <p
                id="auth-required-description"
                className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300"
              >
                {t("authRequired.description")}
              </p>
            </div>

            <button
              ref={primaryButtonRef}
              type="button"
              onClick={() => handleNavigate("/login")}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-red-900 px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(127,29,29,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {t("authRequired.signIn")}
            </button>

            <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
              {t("authRequired.noAccount")}{" "}
              <button
                type="button"
                onClick={() => handleNavigate("/register")}
                className="font-bold text-red-900 transition hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
              >
                {t("authRequired.signUp")}
              </button>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default AuthRequiredModal;
