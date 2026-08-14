import { apiRequest } from "./apiClient";
import { unwrapApiData } from "../utils/responseData";

export async function getMySubscription(token) {
  const data = await apiRequest("/api/User/my-subscription", {
    token,
  });

  return unwrapApiData(data, ["subscription", "mySubscription"]);
}
