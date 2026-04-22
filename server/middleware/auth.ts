import type { H3Event } from "h3";

const PUBLIC_ROUTES: { pattern: RegExp; methods: string[] }[] = [
  { pattern: /^\/api\/auth\/login$/, methods: ["POST"] },
  { pattern: /^\/api\/auth\/register$/, methods: ["POST"] },
  { pattern: /^\/api\/auth\/refresh$/, methods: ["POST"] },
  { pattern: /^\/api\/games$/, methods: ["GET"] },
  { pattern: /^\/api\/games\/[^/]+$/, methods: ["GET"] },
];

function isPublicRoute(path: string, method: string | undefined): boolean {
  return PUBLIC_ROUTES.some(
    (route) => route.pattern.test(path) && (!method || route.methods.includes(method)),
  );
}

export default defineEventHandler((event: H3Event) => {
  const url = getRequestURL(event).pathname;

  if (!url.startsWith("/api/") || url.startsWith("/api/_") || isPublicRoute(url, event.method))
    return;

  const token = getCookie(event, CookieName.AccessToken);

  if (!token) {
    return createResponse(
      { code: ApiResponseCode.Unauthorized, message: "Missing authorization token" },
      null,
    );
  }

  const config = useRuntimeConfig();
  const payload = verifyToken<AccessTokenPayload>(token, config.jwt.access);

  if (!payload) {
    return createResponse(
      { code: ApiResponseCode.Unauthorized, message: "Invalid or expired token" },
      null,
    );
  }

  event.context.user = payload;
});

declare module "h3" {
  interface H3EventContext {
    user?: AccessTokenPayload;
  }
}
