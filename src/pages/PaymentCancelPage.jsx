import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "../router/Link";
import { clearCheckoutPlan } from "../utils/paymentSession";

function PaymentCancelPage() {
  const { t } = useTranslation();

  useEffect(() => {
    clearCheckoutPlan();
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <section className="rounded-md border border-red-900/10 bg-white p-6 shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-neutral-950 dark:text-white">
          {t("app.payment.cancelTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {t("app.payment.cancelDescription")}
        </p>
      </section>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/plans"
          className="inline-flex h-11 items-center justify-center rounded-md bg-red-900 px-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {t("app.payment.returnToPlans")}
        </Link>
        <Link
          to="/plan"
          className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-extrabold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
        >
          {t("app.payment.myPlan")}
        </Link>
      </div>
    </div>
  );
}

export default PaymentCancelPage;
