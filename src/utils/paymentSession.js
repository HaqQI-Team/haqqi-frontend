const CHECKOUT_PLAN_KEY = "haqqi_checkout_plan";

export function storeCheckoutPlan(planType) {
  if (typeof planType === "string" && planType.trim()) {
    window.sessionStorage.setItem(CHECKOUT_PLAN_KEY, planType.trim());
  }
}

export function getCheckoutPlan() {
  return window.sessionStorage.getItem(CHECKOUT_PLAN_KEY) || "";
}

export function clearCheckoutPlan() {
  window.sessionStorage.removeItem(CHECKOUT_PLAN_KEY);
}
