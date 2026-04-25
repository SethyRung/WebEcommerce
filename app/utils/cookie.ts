import { appendResponseHeader } from "h3";
import type { FetchContext } from "ofetch";

export function getCookieHeader(options: FetchContext["options"]): string {
  const h = options.headers;
  return h.get("cookie") || h.get("set-cookie") || "";
}

export function forwardCookies(event: ReturnType<typeof useRequestEvent>, response: Response) {
  if (!event) return;
  const cookies = response.headers.getSetCookie?.() ?? [];
  for (const cookie of cookies) {
    appendResponseHeader(event, "set-cookie", cookie);
  }
}
