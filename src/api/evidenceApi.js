import { apiRequest } from "./apiClient";

export function uploadEvidenceFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/api/Evidence/upload", {
    method: "POST",
    body: formData,
  });
}

export function createEvidence(data) {
  return apiRequest("/api/Evidence/create", {
    method: "POST",
    body: data,
  });
}

export function getEvidence(evidenceId) {
  return apiRequest(`/api/Evidence/${evidenceId}`);
}

export function getComplaintEvidence(complaintId) {
  return apiRequest(`/api/Evidence/chat/${complaintId}`);
}

export function deleteEvidence(evidenceId) {
  return apiRequest(`/api/Evidence/${evidenceId}`, {
    method: "DELETE",
  });
}
