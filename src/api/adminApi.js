import { apiRequest } from "./apiClient";

export function ingestRag(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return apiRequest("/api/Admin/ingest-rag", {
    method: "POST",
    body: formData,
  });
}

export function getComplaintsStats() {
  return apiRequest("/api/Admin/complaints-stats", { method: "GET" });
}

export function getAllComplaints({ pageNumber, pageSize }) {
  return apiRequest("/api/Admin/all-complaints", {
    method: "POST",
    body: { pageNumber, pageSize },
  });
}

export function getAllLegalDocuments({ pageNumber, pageSize }) {
  return apiRequest("/api/Admin/all-legal-documents", {
    method: "POST",
    body: { pageNumber, pageSize },
  });
}

export function deleteLegalDocument(documentId) {
  return apiRequest(`/api/Admin/delete-legal-document/${documentId}`, {
    method: "DELETE",
  });
}



