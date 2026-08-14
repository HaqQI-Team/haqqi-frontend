import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/app/EmptyState";
import PlanFeature from "../components/app/PlanFeature";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

function booleanLabel(value, t) {
  return value ? t("app.plan.available") : t("app.plan.notIncluded");
}

function valueOrUnavailable(value, t) {
  if (value === null || value === undefined || value === "") {
    return t("app.plan.notAvailable");
  }

  return String(value);
}

function MyPlanPage() {
  const { t } = useTranslation();
  const { refreshSubscription, subscription } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(subscription);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      if (subscription) {
        setCurrentSubscription(subscription);
        setIsLoading(false);
        return;
      }

      try {
        const data = await refreshSubscription();

        if (isMounted) {
          setCurrentSubscription(data);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, t("app.errors.planLoad")));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      isMounted = false;
    };
  }, [refreshSubscription, subscription, t]);

  if (isLoading) {
    return <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t("app.common.loading")}</p>;
  }

  if (error) {
    return <EmptyState title={t("app.errors.planLoad")} description={error} />;
  }

  const plan = currentSubscription?.plan || t("app.plan.unknownPlan");

  return (
    <div className="space-y-6">
      <header className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
        <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
          {t("app.plan.eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
          {plan}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {t("app.plan.description")}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <PlanFeature
          label={t("app.plan.price")}
          value={valueOrUnavailable(currentSubscription?.price, t)}
        />
        <PlanFeature
          label={t("app.plan.aiMessages")}
          value={t("app.plan.messagesPerDay", {
            count: currentSubscription?.dailyAiMessagesLimit ?? 0,
          })}
        />
        <PlanFeature
          label={t("app.plan.activeComplaints")}
          value={t("app.plan.upToComplaints", {
            count: currentSubscription?.maxActiveComplaints ?? 0,
          })}
        />
        <PlanFeature
          label={t("app.plan.evidence")}
          value={t("app.plan.upToEvidence", {
            count: currentSubscription?.maxEvidenceFilesPerComplaint ?? 0,
          })}
        />
        <PlanFeature
          label={t("app.plan.pdfUpload")}
          value={booleanLabel(currentSubscription?.canUploadPdf, t)}
        />
        <PlanFeature
          label={t("app.plan.pdfExport")}
          value={booleanLabel(currentSubscription?.canExportPdf, t)}
        />
        <PlanFeature
          label={t("app.plan.priorityProcessing")}
          value={booleanLabel(currentSubscription?.priorityProcessing, t)}
        />
      </section>

      <section className="rounded-md border border-red-900/10 bg-[#fff8f4] p-5 text-start dark:border-red-300/10 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-neutral-950 dark:text-white">
              <FontAwesomeIcon icon={faCrown} className="text-red-900 dark:text-red-200" />
              <span>{t("app.nav.upgradePlan")}</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("app.plan.upgradeDescription")}
            </p>
          </div>
          <button
            type="button"
            disabled
            className="rounded-md bg-red-900 px-4 py-2 text-sm font-extrabold text-white opacity-60 dark:bg-red-700"
          >
            {t("app.common.comingSoon")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default MyPlanPage;
