import { apiRequest } from "./apiClient";

export function getComplaintDraft(complaintId) {
  return apiRequest(`/api/Draft/${complaintId}`);
}

export function exportComplaintDraft(complaintId) {
  return apiRequest(`/api/Draft/${complaintId}/export`);
}
