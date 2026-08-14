export function formatDate(value, language = "en") {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
