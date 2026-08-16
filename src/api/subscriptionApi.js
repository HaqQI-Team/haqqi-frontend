import { apiRequest } from "./apiClient";
import { unwrapApiData } from "../utils/responseData";

export async function getMySubscription(token) {
  const data = await apiRequest("/api/User/my-subscription", {
    token,
  });

  return unwrapApiData(data, ["subscription", "mySubscription"]);
}

export async function getSubscriptionPlans() {
  return apiRequest("/api/subscription/plans");
}

export async function createSubscriptionCheckout(planId) {
  return apiRequest("/api/subscription/checkout", {
    method: "POST",
    body: planId,
  });
}
