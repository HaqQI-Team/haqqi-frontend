import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClipboardCheck,
  faFileCirclePlus,
  faGavel,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { createComplaint } from "../api/complaintApi";
import InlineAlert from "../components/app/InlineAlert";
import { useRouter } from "../router/useRouter";
import { getApiErrorDetails } from "../utils/apiError";
import { extractComplaintId } from "../utils/responseData";

const guideIcons = [faClipboardCheck, faGavel, faPaperclip];

function NewComplaintPage() {
  const { i18n, t } = useTranslation();
  const { navigate } = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const isRtl = i18n.dir() === "rtl";
  const guideItems = t("app.newComplaint.guideItems", { returnObjects: true });

  async function handleStart() {
    setIsCreating(true);
    setErrorDetails(null);

    try {
      const response = await createComplaint();
      const complaintId = extractComplaintId(response);

      if (!complaintId) {
        throw new Error(t("app.errors.complaintIdMissing"));
      }

      navigate(`/complaints/${complaintId}`);
    } catch (createError) {
      setErrorDetails(getApiErrorDetails(createError));
    } finally {
      setIsCreating(false);
    }
  }

  function renderError() {
    if (!errorDetails) {
      return null;
    }

    if (errorDetails.type === "activeComplaintLimit") {
      return (
        <InlineAlert
          title={t("app.errors.activeComplaintLimitTitle")}
          description={t("app.errors.activeComplaintLimitDescription")}
          action={
            <button
              type="button"
              onClick={() => navigate("/complaints")}
              className="rounded-md bg-red-900 px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {t("app.complaints.viewMyComplaints")}
            </button>
          }
        />
      );
    }

    return (
      <InlineAlert
        title={errorDetails.message || t("app.errors.createComplaint")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
        <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
          {t("app.newComplaint.eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
          {t("app.newComplaint.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
          {t("app.newComplaint.description")}
        </p>

        {Array.isArray(guideItems) ? (
          <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guideItems.map((item, index) => (
              <article
                key={item}
                className="min-w-0 rounded-md border border-red-900/10 bg-[#fff8f4] p-4 dark:border-red-300/10 dark:bg-neutral-950"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
                  <FontAwesomeIcon icon={guideIcons[index] ?? faClipboardCheck} />
                </span>
                <p className="mt-4 break-words text-sm font-bold leading-6 text-neutral-700 dark:text-neutral-200">
                  {item}
                </p>
              </article>
            ))}
          </div>
        ) : null}

        {errorDetails ? <div className="mt-6">{renderError()}</div> : null}

        <button
          type="button"
          disabled={isCreating}
          onClick={handleStart}
          className="group mt-8 inline-flex items-center justify-center gap-3 rounded-md bg-red-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
        >
          <FontAwesomeIcon icon={faFileCirclePlus} />
          <span>{isCreating ? t("app.newComplaint.starting") : t("app.newComplaint.start")}</span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className={`transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
          />
        </button>
      </section>
    </div>
  );
}

export default NewComplaintPage;
