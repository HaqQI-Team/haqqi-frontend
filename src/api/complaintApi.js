import { apiRequest } from "./apiClient";

export function createComplaint() {
  return apiRequest("/api/Complaint/create", {
    method: "POST",
  });
}

export function getMyComplaints() {
  return apiRequest("/api/Complaint/my");
}

export function getComplaint(complaintId) {
  return apiRequest(`/api/Complaint/${complaintId}`);
}

export function getComplaintMessages(complaintId) {
  return apiRequest(`/api/Complaint/messages/${complaintId}`);
}

export function sendComplaintMessage(complaintId, prompt) {
  return apiRequest(`/api/Complaint/${complaintId}/chat`, {
    method: "POST",
    body: { prompt },
  });
}

export function deleteComplaint(complaintId) {
  return apiRequest(`/api/Complaint/${complaintId}`, {
    method: "DELETE",
  });
}
