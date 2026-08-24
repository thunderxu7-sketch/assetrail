export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(requestHost && new URL(origin).host === requestHost);
  } catch {
    return false;
  }
}

export function hasSafeJsonBody(request: Request, maxBytes = 4_096) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  return contentType.includes("application/json") && Number.isFinite(contentLength) && contentLength <= maxBytes;
}
