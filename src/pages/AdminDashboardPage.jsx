import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleCheck,
  faCircleExclamation,
  faClipboardList,
  faClock,
  faFilePdf,
  faScaleBalanced,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getComplaintsStats } from "../api/adminApi";
import AdminSidebar from "../components/admin/AdminSidebar";
import EmptyState from "../components/app/EmptyState";
import PlanFeature from "../components/app/PlanFeature";
import LanguageToggle from "../components/common/LanguageToggle";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import { getApiErrorMessage } from "../utils/apiError";
import { getProfileDisplayName } from "../utils/authResponse";

function AdminDashboardPage() {
  const { i18n, t } = useTranslation();
  const { logout, user } = useAuth();
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isRtl = i18n.dir() === "rtl";
  const displayName = getProfileDisplayName(user);
  const email = typeof user?.email === "string" ? user.email : "";

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        setIsLoading(true);
        const data = await getComplaintsStats();
        if (isMounted) {
          setStats(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, t("admin.errors.statsLoad")));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [t]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen bg-[#fbf7f5] text-neutral-950 dark:bg-neutral-950 dark:text-white ${
        isRtl ? "lg:pr-72" : "lg:pl-72"
      }`}
    >
      <aside className="fixed inset-y-0 hidden w-72 border-red-900/10 bg-[#fffaf7] p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 lg:block ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l">
        <AdminSidebar
          displayName={displayName}
          email={email}
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
          <div className="inline-flex items-center gap-2 text-base font-extrabold text-red-900 dark:text-red-200">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
              <FontAwesomeIcon icon={faScaleBalanced} />
            </span>
            <span>{t("admin.brand")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-[110] bg-black/50 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsMenuOpen(false);
            }
          }}
        >
          <aside
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
            <AdminSidebar
              displayName={displayName}
              email={email}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl min-w-0 space-y-6">
          {isLoading ? (
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {t("app.common.loading")}
            </p>
          ) : error ? (
            <EmptyState
              title={t("admin.errors.statsLoad")}
              description={error}
            />
          ) : (
            <>
              <header className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
                <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
                  {t("admin.dashboard.eyebrow")}
                </p>
                <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
                  {t("admin.dashboard.title")}
                </h1>
              </header>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <PlanFeature
                  label={t("admin.dashboard.stats.total")}
                  value={stats?.totalComplaints ?? 0}
                  icon={faClipboardList}
                />
                <PlanFeature
                  label={t("admin.dashboard.stats.pending")}
                  value={stats?.totalPendingComplaints ?? 0}
                  icon={faClock}
                />
                <PlanFeature
                  label={t("admin.dashboard.stats.ready")}
                  value={stats?.totalReadyComplaints ?? 0}
                  icon={faCircleCheck}
                />
                <PlanFeature
                  label={t("admin.dashboard.stats.cited")}
                  value={stats?.totalCitedComplaints ?? 0}
                  icon={faScaleBalanced}
                />
                <PlanFeature
                  label={t("admin.dashboard.stats.exported")}
                  value={stats?.totalExportedComplaints ?? 0}
                  icon={faFilePdf}
                />
                <PlanFeature
                  label={t("admin.dashboard.stats.failed")}
                  value={stats?.totalFailedComplaints ?? 0}
                  icon={faCircleExclamation}
                />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
