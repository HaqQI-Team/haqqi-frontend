import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faCrown,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import {
  createSubscriptionCheckout,
  getSubscriptionPlans,
} from "../api/subscriptionApi";
import EmptyState from "../components/app/EmptyState";
import InlineAlert from "../components/app/InlineAlert";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";
import { getCheckoutRedirectUrl } from "../utils/checkout";
import { storeCheckoutPlan } from "../utils/paymentSession";
import { getPlanRank } from "../utils/planRank";

function formatPrice(price, t) {
  if (price === 0) {
    return t("app.plans.freePrice");
  }

  if (price === null || price === undefined || price === "") {
    return t("app.plan.notAvailable");
  }

  return t("app.plans.price", { price });
}

function isCurrentPlan(plan, subscription) {
  const currentPlan = subscription?.plan;

  return (
    Boolean(currentPlan) &&
    String(currentPlan).toLowerCase() === String(plan?.type).toLowerCase()
  );
}

function getPlanAction(plan, subscription) {
  if (isCurrentPlan(plan, subscription)) {
    return "current";
  }

  const currentRank = getPlanRank(subscription?.plan);
  const targetRank = getPlanRank(plan?.type);

  if (
    currentRank === -1 ||
    targetRank === -1 ||
    targetRank <= currentRank
  ) {
    return "lower";
  }

  return "upgrade";
}

function Capability({ enabled, enabledLabel, disabledLabel }) {
  return (
    <li className="flex min-w-0 items-start gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
      <FontAwesomeIcon
        icon={enabled ? faCircleCheck : faCircleXmark}
        className={`mt-1 shrink-0 ${
          enabled
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-neutral-400 dark:text-neutral-500"
        }`}
      />
      <span>{enabled ? enabledLabel : disabledLabel}</span>
    </li>
  );
}

function PlansPage() {
  const { t } = useTranslation();
  const { subscription } = useAuth();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutPlanId, setCheckoutPlanId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        const data = await getSubscriptionPlans();

        if (isMounted) {
          setPlans(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, t("app.errors.plansLoad")));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, [t]);

  if (isLoading) {
    return <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t("app.common.loading")}</p>;
  }

  if (error) {
    return <EmptyState title={t("app.errors.plansLoad")} description={error} />;
  }

  async function handleUpgrade(plan) {
    if (checkoutPlanId) {
      return;
    }

    setCheckoutError("");
    setCheckoutPlanId(plan.id);

    try {
      const response = await createSubscriptionCheckout(plan.id);
      const checkoutUrl = getCheckoutRedirectUrl(response);

      if (!checkoutUrl) {
        throw new Error(t("app.errors.checkoutUrlMissing"));
      }

      storeCheckoutPlan(plan.type);
      window.location.assign(checkoutUrl);
    } catch (checkoutStartError) {
      setCheckoutError(
        getApiErrorMessage(checkoutStartError, t("app.errors.checkoutStart")),
      );
      setCheckoutPlanId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
        <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
          {t("app.plans.eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
          {t("app.plans.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {t("app.plans.description")}
        </p>
      </header>

      {checkoutError ? (
        <InlineAlert
          title={t("app.errors.checkoutStart")}
          description={checkoutError}
        />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const planAction = getPlanAction(plan, subscription);
          const isActive = planAction === "current";
          const canUpgrade = planAction === "upgrade";
          const isCheckingOut = checkoutPlanId === plan.id;

          return (
            <article
              key={plan.id}
              className="flex min-w-0 flex-col rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold uppercase text-red-900 dark:text-red-200">
                    {plan.type}
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold text-neutral-950 dark:text-white">
                    {formatPrice(plan.price, t)}
                  </h2>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
                  <FontAwesomeIcon icon={isActive ? faCrown : faLayerGroup} />
                </span>
              </div>

              <ul className="mt-5 space-y-2">
                <li className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {t("app.plans.aiMessages", {
                    count: plan.dailyAiMessagesLimit ?? 0,
                  })}
                </li>
                <li className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {t("app.plans.activeComplaints", {
                    count: plan.maxActiveComplaints ?? 0,
                  })}
                </li>
                <li className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {t("app.plans.evidenceFiles", {
                    count: plan.maxEvidenceFilesPerComplaint ?? 0,
                  })}
                </li>
                <Capability
                  enabled={Boolean(plan.canUploadPdf)}
                  enabledLabel={t("app.plans.pdfUploadIncluded")}
                  disabledLabel={t("app.plans.pdfUploadNotIncluded")}
                />
                <Capability
                  enabled={Boolean(plan.canExportPdf)}
                  enabledLabel={t("app.plans.pdfExportIncluded")}
                  disabledLabel={t("app.plans.pdfExportNotIncluded")}
                />
                <Capability
                  enabled={Boolean(plan.priorityProcessing)}
                  enabledLabel={t("app.plans.priorityIncluded")}
                  disabledLabel={t("app.plans.standardProcessing")}
                />
              </ul>

              {isActive ? (
                <div className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-md border border-red-900/20 bg-red-900/[0.08] px-4 text-sm font-extrabold text-red-900 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-200">
                  {t("app.plans.currentPlan")}
                </div>
              ) : null}

              {canUpgrade ? (
                <button
                  type="button"
                  disabled={isCheckingOut}
                  onClick={() => handleUpgrade(plan)}
                  className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-md bg-red-900 px-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  {isCheckingOut ? t("app.plans.redirecting") : t("app.plans.upgrade")}
                </button>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default PlansPage;
