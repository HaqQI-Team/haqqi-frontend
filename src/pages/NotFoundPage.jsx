import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClipboardList,
  faHouse,
  faScaleBalanced,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import notFoundIllustration from "../assets/not-found-haqqi.png";
import LanguageToggle from "../components/common/LanguageToggle";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import Link from "../router/Link";
import { useRouter } from "../router/useRouter";

function NotFoundAction({ to, icon, children, variant = "secondary" }) {
  const className =
    variant === "primary"
      ? "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-900 px-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600 sm:w-auto"
      : "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-200 px-4 text-sm font-extrabold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200 sm:w-auto";

  return (
    <Link to={to} className={className}>
      <FontAwesomeIcon icon={icon} />
      <span>{children}</span>
    </Link>
  );
}

function NotFoundPage() {
  const { i18n, t } = useTranslation();
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { location } = useRouter();
  const isRtl = i18n.dir() === "rtl";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7f5] px-4 py-6 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-lg font-extrabold text-red-900 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 dark:text-red-200"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-red-900 text-white dark:bg-red-700">
              <FontAwesomeIcon icon={faScaleBalanced} />
            </span>
            <span>{t("brand.name")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div className="order-2 min-w-0 text-start lg:order-1">
            <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
              {t("notFound.code")}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-neutral-950 dark:text-white sm:text-5xl">
              {t("notFound.title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
              {t("notFound.description")}
            </p>
            {location.pathname ? (
              <p className="mt-4 max-w-full break-words rounded-md border border-red-900/10 bg-white px-3 py-2 text-xs font-bold text-neutral-500 dark:border-red-300/10 dark:bg-neutral-900 dark:text-neutral-400">
                {t("notFound.pathLabel", { path: location.pathname })}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <NotFoundAction to="/" icon={faHouse} variant="primary">
                {t("notFound.goHome")}
              </NotFoundAction>

              {!isLoading && isAuthenticated && isAdmin ? (
                <NotFoundAction to="/admin" icon={faUserShield}>
                  {t("notFound.goAdmin")}
                </NotFoundAction>
              ) : null}

              {!isLoading && isAuthenticated && !isAdmin ? (
                <NotFoundAction to="/complaints" icon={faClipboardList}>
                  {t("notFound.myComplaints")}
                </NotFoundAction>
              ) : null}

              {!isLoading && !isAuthenticated ? (
                <NotFoundAction to="/login" icon={faArrowRight}>
                  {t("notFound.signIn")}
                </NotFoundAction>
              ) : null}
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
              <img
                src={notFoundIllustration}
                alt={t("notFound.illustrationAlt")}
                className="h-auto w-full"
              />
          </div>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
