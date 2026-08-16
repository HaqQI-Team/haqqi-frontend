function isUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function getCheckoutRedirectUrl(response) {
  if (isUrl(response)) {
    return response.trim();
  }

  if (!response || typeof response !== "object") {
    return "";
  }

  const candidates = [
    response.url,
    response.checkoutUrl,
    response.checkoutURL,
    response.redirectUrl,
    response.redirectURL,
    response.paymentUrl,
    response.paymentURL,
    response.session?.url,
  ];

  return candidates.find(isUrl)?.trim() ?? "";
}
