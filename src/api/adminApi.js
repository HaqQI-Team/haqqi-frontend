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
