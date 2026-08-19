import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { getMyComplaints } from "../api/complaintApi";
import ComplaintCard from "../components/app/ComplaintCard";
import EmptyState from "../components/app/EmptyState";
import StatusBadge from "../components/app/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import {
  getComplaintStatus,
  getComplaintTitle,
  getUpdatedAt,
} from "../utils/complaintData";
import { getApiErrorMessage } from "../utils/apiError";
import { unwrapApiArray } from "../utils/responseData";

function getComplaintId(complaint) {
  return complaint?.id ?? complaint?.complaintId ?? complaint?.complaintID;
}

function getMostRecentComplaint(complaints) {
  return [...complaints].sort((a, b) => {
    const aTime = new Date(getUpdatedAt(a)).getTime() || 0;
    const bTime = new Date(getUpdatedAt(b)).getTime() || 0;
    return bTime - aTime;
  })[0];
}

function MyComplaintsPage() {
  const { i18n, t } = useTranslation();
  const { navigate } = useRouter();
  const { subscription } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isRtl = i18n.dir() === "rtl";
  const maxActive = subscription?.maxActiveComplaints;

  useEffect(() => {
    let isMounted = true;

    async function loadComplaints() {
      try {
        const data = await getMyComplaints();

        if (isMounted) {
          setComplaints(unwrapApiArray(data, ["complaints", "myComplaints"]));
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, t("app.errors.complaintsLoad")));
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
  }, [t]);

  const recentComplaint = useMemo(
    () => getMostRecentComplaint(complaints),
    [complaints],
  );

  function openComplaint(complaint) {
    const complaintId = getComplaintId(complaint);

    if (complaintId) {
      navigate(`/complaints/${complaintId}`);
    }
  }

  if (isLoading) {
    return <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t("app.common.loading")}</p>;
  }

  if (error) {
    return <EmptyState title={t("app.errors.complaintsLoad")} description={error} />;
  }

  if (complaints.length === 0) {
    return (
      <EmptyState
        title={t("app.complaints.emptyTitle")}
        description={t("app.complaints.emptyDescription")}
        action={
          <button
            type="button"
            onClick={() => navigate("/complaints/new")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faFileCirclePlus} />
            <span>{t("app.newComplaint.start")}</span>
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
            {t("app.complaints.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-neutral-950 dark:text-white">
            {t("app.complaints.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {t("app.complaints.description")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-extrabold text-neutral-600 dark:text-neutral-300">
            {maxActive ? (
              <span className="inline-flex rounded-md border border-red-900/10 bg-[#fff8f4] px-2.5 py-1 text-red-900 dark:border-red-300/10 dark:bg-neutral-900 dark:text-red-200">
                {t("app.complaints.planLimit", { count: maxActive })}
              </span>
            ) : null}
            <span className="inline-flex rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              {t("app.complaints.totalCount", { count: complaints.length })}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/complaints/new")}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-red-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
        >
          <FontAwesomeIcon icon={faFileCirclePlus} />
          <span>{t("app.newComplaint.start")}</span>
        </button>
      </header>

      {recentComplaint ? (
        <section className="rounded-md border border-red-900/10 bg-[#fff8f4] p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
          <p className="text-sm font-extrabold text-red-900 dark:text-red-200">
            {t("app.complaints.continueWhere")}
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                {getComplaintTitle(recentComplaint, t("app.complaints.untitled"))}
              </h2>
              <div className="mt-3">
                <StatusBadge status={getComplaintStatus(recentComplaint)} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => openComplaint(recentComplaint)}
              className="group inline-flex w-fit items-center gap-2 rounded-md bg-red-900 px-4 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
            >
              <span>{t("app.complaints.continueComplaint")}</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className={`transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              />
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={getComplaintId(complaint) ?? JSON.stringify(complaint)}
            complaint={complaint}
            onContinue={() => openComplaint(complaint)}
          />
        ))}
      </section>
    </div>
  );
}

export default MyComplaintsPage;
