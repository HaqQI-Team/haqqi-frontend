import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faScaleBalanced,
  faXmark,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getAllComplaints } from "../api/adminApi";
import AdminSidebar from "../components/admin/AdminSidebar";
import EmptyState from "../components/app/EmptyState";
import StatusBadge from "../components/app/StatusBadge";
import LanguageToggle from "../components/common/LanguageToggle";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import { getApiErrorMessage } from "../utils/apiError";
import { getProfileDisplayName } from "../utils/authResponse";
import { formatDate } from "../utils/formatters";

function AdminComplaintsPage() {
  const { i18n, t } = useTranslation();
  const { logout, user } = useAuth();
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pagination and complaints state
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed internally
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // PAGINATION INDEX CONVENTION:
  // The backend API might be 0-based or 1-based.
  // We assume 0-based initially. If requesting page 0 returns pageNumber = 1,
  // or if requesting page 0 fails, we automatically fallback to 1-based indexing.
  const [isZeroBased, setIsZeroBased] = useState(true);

  const isRtl = i18n.dir() === "rtl";
  const displayName = getProfileDisplayName(user);
  const email = typeof user?.email === "string" ? user.email : "";

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadComplaints() {
      try {
        setIsLoading(true);
        // Determine pageNumber parameter based on current indexing assumption
        const apiPage = isZeroBased ? currentPage : currentPage + 1;
        
        const data = await getAllComplaints({
          pageNumber: apiPage,
          pageSize,
        });

        if (isMounted) {
          // If we requested page 0 but the server responded with pageNumber: 1,
          // it means the server is using 1-based indexing. Update our assumption.
          if (apiPage === 0 && data?.pageNumber === 1) {
            setIsZeroBased(false);
            return; // useEffect will re-run with pageNumber: 1
          }

          setComplaints(data?.complaints || []);
          setTotalCount(data?.totalCount ?? 0);
          setTotalPages(data?.totalPages ?? 0);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          // If page 0 failed, retry using 1-based indexing
          if (isZeroBased && currentPage === 0) {
            setIsZeroBased(false);
            return;
          }
          setError(getApiErrorMessage(err, t("admin.errors.complaintsLoad")));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComplaints();

    return () => {
      isMounted = false;
    };
  }, [currentPage, isZeroBased, pageSize, t]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen bg-[#fbf7f5] text-neutral-950 dark:bg-neutral-950 dark:text-white ${
        isRtl ? "lg:pr-72" : "lg:pl-72"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 hidden w-72 border-red-900/10 bg-[#fffaf7] p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 lg:block ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l">
        <AdminSidebar
          displayName={displayName}
          email={email}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sticky Header */}
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

      {/* Mobile Slide-over Drawer Menu */}
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

      {/* Main Content Area */}
      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl min-w-0 space-y-6">
          {isLoading && complaints.length === 0 ? (
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {t("app.common.loading")}
            </p>
          ) : error ? (
            <EmptyState
              title={t("admin.errors.complaintsLoad")}
              description={error}
            />
          ) : (
            <>
              {/* Header block */}
              <header className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
                <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
                  {t("admin.complaints.eyebrow")}
                </p>
                <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
                  {t("admin.complaints.title")}
                </h1>
              </header>

              {complaints.length === 0 ? (
                <EmptyState title={t("admin.complaints.emptyTitle")} />
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto rounded-md border border-red-900/10 bg-white shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
                      <table className="w-full table-auto border-collapse text-start">
                        <thead>
                          <tr className="border-b border-red-900/10 bg-red-900/[0.02] dark:border-red-300/10 dark:bg-white/[0.02]">
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.title")}
                            </th>
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.status")}
                            </th>
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.domain")}
                            </th>
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.authority")}
                            </th>
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.updated")}
                            </th>
                            <th className="px-6 py-4 text-start text-xs font-bold uppercase text-neutral-400">
                              {t("admin.complaints.columns.citations")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-900/10 dark:divide-red-300/10">
                          {complaints.map((complaint) => {
                            const title = complaint.title || t("app.complaints.untitled");
                            const citationsCount = complaint.complaintCitations?.length || 0;
                            return (
                              <tr
                                key={complaint.id}
                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                              >
                                <td className="px-6 py-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100 break-words max-w-[240px]">
                                  {title}
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge status={complaint.status} />
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                  {complaint.domain || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                  {complaint.authorityName || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                  {formatDate(complaint.updatedAt, i18n.language)}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                  {citationsCount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="space-y-4 md:hidden">
                    {complaints.map((complaint) => {
                      const title = complaint.title || t("app.complaints.untitled");
                      const citationsCount = complaint.complaintCitations?.length || 0;
                      const updatedAt = formatDate(complaint.updatedAt, i18n.language);

                      return (
                        <div
                          key={complaint.id}
                          className="min-w-0 rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h2 className="break-words text-base font-extrabold leading-6 text-neutral-950 dark:text-white">
                              {title}
                            </h2>
                            <div className="shrink-0">
                              <StatusBadge status={complaint.status} />
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-bold uppercase text-xs">
                                {t("admin.complaints.columns.domain")}:
                              </span>
                              <span className="break-words">{complaint.domain || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-bold uppercase text-xs">
                                {t("admin.complaints.columns.authority")}:
                              </span>
                              <span className="break-words">{complaint.authorityName || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-bold uppercase text-xs">
                                {t("admin.complaints.columns.citations")}:
                              </span>
                              <span className="break-words">{citationsCount}</span>
                            </div>
                          </div>

                          {updatedAt ? (
                            <p className="mt-4 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                              {t("admin.complaints.columns.updated")}: {updatedAt}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col items-center justify-between gap-4 border-t border-red-900/10 pt-6 dark:border-red-300/10 sm:flex-row">
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
                      {t("admin.pagination.pageOf", {
                        current: currentPage + 1,
                        total: totalPages,
                      })}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={currentPage === 0 || isLoading}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
                      >
                        <FontAwesomeIcon
                          icon={isRtl ? faArrowRight : faArrowLeft}
                          className={isRtl ? "" : "mr-2 rtl:ml-2"}
                        />
                        <span>{t("admin.pagination.previous")}</span>
                      </button>
                      <button
                        type="button"
                        disabled={currentPage + 1 >= totalPages || isLoading}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
                      >
                        <span>{t("admin.pagination.next")}</span>
                        <FontAwesomeIcon
                          icon={isRtl ? faArrowLeft : faArrowRight}
                          className={isRtl ? "" : "ml-2 rtl:mr-2"}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminComplaintsPage;
