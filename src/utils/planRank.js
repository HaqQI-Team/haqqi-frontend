/**
 * Fallback plan rank ordering used when the full available plans list
 * is not loaded in local component state (e.g. inside AppLayout sidebar).
 * Update this map if new subscription plans are introduced.
 */
export const PLAN_ORDER = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
};

export function getPlanRank(planType) {
  if (!planType || typeof planType !== "string") {
    return -1;
  }

  const key = planType.trim().toUpperCase();

  return PLAN_ORDER[key] ?? -1;
}

export function isHighestPlan(currentPlanType, availablePlans = []) {
  const currentRank = getPlanRank(currentPlanType);

  if (currentRank < 0) {
    return false;
  }

  const maxAvailableRank =
    Array.isArray(availablePlans) && availablePlans.length > 0
      ? Math.max(...availablePlans.map((p) => getPlanRank(p.type)))
      : Math.max(...Object.values(PLAN_ORDER));

  return currentRank >= maxAvailableRank;
}
