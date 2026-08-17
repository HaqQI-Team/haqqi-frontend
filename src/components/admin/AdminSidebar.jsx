import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClipboardList,
  faFileLines,
  faFilePdf,
  faScaleBalanced,
  faUserShield,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "../../router/useRouter";

const adminNavItems = [
  { path: "/admin/dashboard", labelKey: "admin.nav.dashboard", icon: faChartLine },
  { path: "/admin/complaints", labelKey: "admin.nav.complaints", icon: faClipboardList },
  { path: "/admin", labelKey: "admin.knowledgeBase", icon: faFilePdf },
  { path: "/admin/documents", labelKey: "admin.nav.documents", icon: faFileLines },
];


function AdminSidebar({ displayName, email, onLogout }) {
  const { t } = useTranslation();
  const { location, navigate } = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div className="inline-flex items-center gap-3 text-lg font-extrabold text-red-900 dark:text-red-200">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
          <FontAwesomeIcon icon={faScaleBalanced} />
        </span>
        <span>{t("admin.brand")}</span>
      </div>

      <nav className="mt-8 space-y-2" aria-label={t("admin.navLabel")}>
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
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
        })}
      </nav>

      <div className="mt-auto border-t border-red-900/10 pt-5 dark:border-red-300/10">
        <div className="flex min-w-0 items-start gap-3">
          <FontAwesomeIcon
            icon={faUserShield}
            className="mt-0.5 text-xl text-red-900 dark:text-red-200"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-neutral-950 dark:text-white">
              {displayName || t("admin.identity")}
            </p>
            {email ? (
              <p className="mt-1 truncate text-xs font-bold text-neutral-500 dark:text-neutral-400">
                {email}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
        >
          <FontAwesomeIcon icon={faXmark} />
          <span>{t("admin.signOut")}</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
