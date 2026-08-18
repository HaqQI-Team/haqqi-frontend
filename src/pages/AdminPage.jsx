import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleCheck,
  faCircleExclamation,
  faFilePdf,
  faScaleBalanced,
  faTrash,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ingestRag } from "../api/adminApi";
import AdminSidebar from "../components/admin/AdminSidebar";
import InlineAlert from "../components/app/InlineAlert";
import LanguageToggle from "../components/common/LanguageToggle";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  isNetworkError,
} from "../utils/apiError";
import { getProfileDisplayName } from "../utils/authResponse";

function isPdf(file) {
  return (
    file?.type === "application/pdf" ||
    file?.name?.toLowerCase().endsWith(".pdf")
  );
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getAdminApiErrorMessage(error, t) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");

  if (isNetworkError(error)) {
    return t("auth.errors.network");
  }

  if (status === 400) {
    return message || t("admin.errors.processSelected");
  }

  if (status === 403) {
    return t("admin.errors.permission");
  }

  if (status === 502) {
    return t("admin.errors.aiUnavailable");
  }

  if (status >= 500) {
    return t("admin.errors.processServer");
  }

  return message || t("admin.errors.processSelected");
}

function unwrapIngestResult(response) {
  const result = response?.result ?? response;

  return {
    message: typeof result?.message === "string" ? result.message : "",
    results: Array.isArray(result?.results) ? result.results : [],
  };
}

function formatResultError(error, t) {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error && typeof error === "object" && typeof error.message === "string") {
    return error.message;
  }

  return t("admin.results.unknownIssue");
}



function ResultCard({ result }) {
  const { t } = useTranslation();
  const errors = Array.isArray(result.errors) ? result.errors : [];
  const isSuccessful = errors.length === 0;

  return (
    <article className="rounded-md border border-red-900/10 bg-white p-4 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-extrabold text-neutral-950 dark:text-white">
            {result.filename || t("admin.unknownFile")}
          </h3>
          <p
            className={`mt-1 inline-flex items-center gap-2 text-xs font-extrabold ${
              isSuccessful
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            <FontAwesomeIcon icon={isSuccessful ? faCircleCheck : faCircleExclamation} />
            <span>
              {isSuccessful
                ? t("admin.results.successful")
                : t("admin.results.withIssues")}
            </span>
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-[#fff8f4] p-3 dark:bg-neutral-950">
          <dt className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {t("admin.results.pagesProcessed")}
          </dt>
          <dd className="mt-1 text-lg font-extrabold text-neutral-950 dark:text-white">
            {result.pagesProcessed ?? 0}
          </dd>
        </div>
        <div className="rounded-md bg-[#fff8f4] p-3 dark:bg-neutral-950">
          <dt className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {t("admin.results.chunksCreated")}
          </dt>
          <dd className="mt-1 text-lg font-extrabold text-neutral-950 dark:text-white">
            {result.chunksCreated ?? 0}
          </dd>
        </div>
        <div className="rounded-md bg-[#fff8f4] p-3 dark:bg-neutral-950">
          <dt className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {t("admin.results.recordsInserted")}
          </dt>
          <dd className="mt-1 text-lg font-extrabold text-neutral-950 dark:text-white">
            {result.mongoInserted ?? 0}
          </dd>
        </div>
      </dl>

      {errors.length > 0 ? (
        <ul className="mt-4 space-y-2 rounded-md border border-amber-700/20 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-950/25 dark:text-amber-200">
          {errors.map((item, index) => (
            <li key={`${item}-${index}`} className="break-words">
              {formatResultError(item, t)}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function AdminPage() {
  const { i18n, t } = useTranslation();
  const { logout, user } = useAuth();
  const { navigate } = useRouter();
  const inputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const isRtl = i18n.dir() === "rtl";
  const displayName = getProfileDisplayName(user);
  const email = typeof user?.email === "string" ? user.email : "";

  function handleLogout() {
    logout();
    navigate("/");
  }

  function addFiles(fileList) {
    const files = Array.from(fileList ?? []);
    const pdfFiles = files.filter(isPdf);
    const rejectedCount = files.length - pdfFiles.length;

    setSelectionError(
      rejectedCount > 0 ? t("admin.errors.pdfOnly", { count: rejectedCount }) : "",
    );

    if (pdfFiles.length > 0) {
      setSelectedFiles((currentFiles) => [...currentFiles, ...pdfFiles]);
      setUploadError("");
      setUploadResult(null);
    }
  }

  function handleFileInputChange(event) {
    addFiles(event.target.files);
    event.target.value = "";
  }

  function removeFile(indexToRemove) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleUpload() {
    if (selectedFiles.length === 0 || isUploading) {
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadResult(null);

    try {
      const response = await ingestRag(selectedFiles);
      setUploadResult(unwrapIngestResult(response));
      setSelectedFiles([]);
    } catch (error) {
      setUploadError(getAdminApiErrorMessage(error, t));
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragActive(false);

    if (!isUploading) {
      addFiles(event.dataTransfer.files);
    }
  }

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
          <header className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
            <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
              {t("admin.knowledgeBase")}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
              {t("admin.legalKnowledgeBase")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("admin.knowledgeDescription")}
            </p>
          </header>

          <section className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-6">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="sr-only"
              onChange={handleFileInputChange}
              disabled={isUploading}
            />

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`rounded-md border border-dashed p-6 text-center transition ${
                isDragActive
                  ? "border-red-800 bg-red-900/[0.04] dark:border-red-300 dark:bg-red-300/10"
                  : "border-red-900/20 bg-[#fff8f4] dark:border-red-300/15 dark:bg-neutral-950"
              }`}
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <h2 className="mt-4 text-lg font-extrabold text-neutral-950 dark:text-white">
                {t("admin.upload.selectPdf")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("admin.upload.dropHint")}
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="mt-4 rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
              >
                {t("admin.upload.browse")}
              </button>
            </div>

            {selectionError ? (
              <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300">
                {selectionError}
              </p>
            ) : null}

            {selectedFiles.length > 0 ? (
              <div className="mt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-sm font-extrabold text-neutral-950 dark:text-white">
                    {t("admin.upload.selectedDocuments", {
                      count: selectedFiles.length,
                    })}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    disabled={isUploading}
                    className="w-fit text-sm font-bold text-red-900 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200 dark:hover:text-red-100"
                  >
                    {t("admin.upload.clearSelection")}
                  </button>
                </div>

                <ul className="mt-3 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex min-w-0 flex-col gap-3 rounded-md border border-red-900/10 bg-[#fff8f4] p-3 dark:border-red-300/10 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="shrink-0 text-red-900 dark:text-red-200"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-neutral-950 dark:text-white">
                            {file.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                        className="inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold text-red-900 transition hover:bg-red-900/[0.07] disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200 dark:hover:bg-red-300/10"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>{t("admin.upload.remove")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {uploadError ? (
              <div className="mt-5">
                <InlineAlert
                  title={t("admin.errors.processSelected")}
                  description={uploadError}
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-red-900 px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600 sm:w-auto"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>
                {isUploading
                  ? t("admin.upload.processing")
                  : t("admin.upload.submit", { count: selectedFiles.length })}
              </span>
            </button>
          </section>

          {uploadResult ? (
            <section className="space-y-4">
              {uploadResult.message ? (
                <p className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-start text-sm font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/25 dark:text-emerald-300">
                  {uploadResult.message}
                </p>
              ) : null}

              {uploadResult.results.map((result, index) => (
                <ResultCard
                  key={`${result.filename ?? "result"}-${index}`}
                  result={result}
                />
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
