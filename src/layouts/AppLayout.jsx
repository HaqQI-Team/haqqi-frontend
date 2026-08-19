import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faCrown,
  faFileCirclePlus,
  faHouse,
  faLayerGroup,
  faRightFromBracket,
  faScaleBalanced,
  faUserCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import LanguageToggle from "../components/common/LanguageToggle";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import { getProfileDisplayName } from "../utils/authResponse";
import { isHighestPlan } from "../utils/planRank";
import ConfirmDialog from "../components/app/ConfirmDialog";

const navItems = [
  { path: "/", labelKey: "app.nav.home", icon: faHouse },
  { path: "/complaints/new", labelKey: "app.nav.newComplaint", icon: faFileCirclePlus },
  { path: "/complaints", labelKey: "app.nav.myComplaints", icon: faClipboardList },
  { path: "/plan", labelKey: "app.nav.myPlan", icon: faLayerGroup },
  { path: "/plans", labelKey: "app.nav.upgradePlan", icon: faCrown },
];

function getPlanLabel(subscription, t) {
  const plan = subscription?.plan;

  if (!plan) {
    return "";
  }

  return t("app.sidebar.planLabel", { plan });
}

function AppNavButton({ item, isActive, onNavigate }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.path)}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-start text-sm font-bold transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:focus-visible:outline-red-300 ${
        isActive
          ? "bg-red-900 text-white shadow-sm dark:bg-red-700"
          : "text-neutral-700 hover:bg-red-900/[0.07] hover:text-red-900 dark:text-neutral-200 dark:hover:bg-red-300/10 dark:hover:text-red-100"
      }`}
    >
      <FontAwesomeIcon icon={item.icon} className="w-4 shrink-0" />
      <span>{t(item.labelKey)}</span>
    </button>
  );
}

function SidebarContent({ subscription, onNavigate, onLogout }) {
  const { t } = useTranslation();
  const { location } = useRouter();
  const { user } = useAuth();
  const displayName = getProfileDisplayName(user) || t("navigation.account");
  const planLabel = getPlanLabel(subscription, t);
  const isHighest = isHighestPlan(subscription?.plan);
  const visibleNavItems = navItems.filter(
    (item) => !(isHighest && item.path === "/plans"),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="inline-flex w-fit items-center gap-3 text-lg font-extrabold text-red-900 transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 dark:text-red-200"
        >
          <span className="grid h-9 w-9 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
            <FontAwesomeIcon icon={faScaleBalanced} />
          </span>
          <span>{t("brand.name")}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <LanguageToggle compact />
          <ThemeToggle />
        </div>
      </div>

      <nav className="mt-8 space-y-2" aria-label={t("app.nav.label")}>
        {visibleNavItems.map((item) => (
          <AppNavButton
            key={item.path}
            item={item}
            isActive={
              item.path === "/complaints"
                ? location.pathname === "/complaints"
                : location.pathname === item.path
            }
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-red-900/10 pt-5 dark:border-red-300/10">
        <div className="flex min-w-0 items-start gap-3">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="mt-0.5 text-xl text-red-900 dark:text-red-200"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-neutral-950 dark:text-white">
              {displayName}
            </p>
            {planLabel ? (
              <p className="mt-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                {planLabel}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>{t("navigation.logout")}</span>
        </button>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const { i18n, t } = useTranslation();
  const { logout, subscription } = useAuth();
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const isRtl = i18n.dir() === "rtl";

  const handleNavigate = useCallback(
    (path) => {
      setIsMenuOpen(false);
      navigate(path);
    },
    [navigate],
  );

  const handleLogout = useCallback(() => {
    setIsLogoutConfirmOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
    setIsLogoutConfirmOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  }, [logout, navigate]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen bg-[#fbf7f5] text-neutral-950 dark:bg-neutral-950 dark:text-white ${
        isRtl ? "lg:pr-72" : "lg:pl-72"
      }`}
    >
      <aside className="fixed inset-y-0 hidden w-72 border-red-900/10 bg-[#fffaf7] p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 lg:block ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l">
        <SidebarContent
          subscription={subscription}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </aside>

      <header className="sticky top-0 z-40 border-b border-red-950/10 bg-[#fbf7f5]/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("navigation.openMenu")}
            className="grid h-10 w-10 place-items-center rounded-md border border-neutral-200 text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/")}
            className="inline-flex items-center gap-2 text-base font-extrabold text-red-900 dark:text-red-200"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
              <FontAwesomeIcon icon={faScaleBalanced} />
            </span>
            <span>{t("brand.name")}</span>
          </button>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[110] bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsMenuOpen(false);
              }
            }}
          >
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`absolute inset-y-0 w-[min(21rem,88vw)] bg-[#fffaf7] p-5 shadow-2xl dark:bg-neutral-900 ${
                isRtl ? "right-0" : "left-0"
              }`}
            >
              <button
                type="button"
                aria-label={t("navigation.closeMenu")}
                onClick={() => setIsMenuOpen(false)}
                className={`absolute top-4 grid h-9 w-9 place-items-center rounded-md text-neutral-500 transition hover:bg-red-900/8 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white ${
                  isRtl ? "left-4" : "right-4"
                }`}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <SidebarContent
                subscription={subscription}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl min-w-0">{children}</div>
      </main>

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title={t("logoutConfirm.title")}
        description={t("logoutConfirm.message")}
        confirmLabel={t("logoutConfirm.confirm")}
        cancelLabel={t("logoutConfirm.cancel")}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}

export default AppLayout;
