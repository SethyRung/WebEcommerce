import type { H3Event } from "h3";

const PUBLIC_ROUTES: {
  path: string;
  methods: string[];
}[] = [
  { path: "/api/auth/login", methods: ["POST"] },
  { path: "/api/auth/register", methods: ["POST"] },
  { path: "/api/auth/refresh", methods: ["POST"] },
  { path: "/api/games", methods: ["GET"] },
  { path: "/api/games/[id]", methods: ["GET"] },
];

function matchesPublicRoute(path: string, routePath: string): boolean {
  if (routePath.startsWith("^")) {
    const regex = new RegExp(routePath.replace("^", ""));
    return regex.test(path);
  }
  return path === routePath;
}

function findPublicRoute(path: string, method: string | undefined): boolean {
  return PUBLIC_ROUTES.some(
    (route) =>
      matchesPublicRoute(path, route.path) &&
      (!route.methods.length || (method && route.methods.includes(method))),
  );
}

export default defineEventHandler((event: H3Event) => {
  const url = getRequestURL(event).pathname;

  // Skip non-API routes
  if (!url.startsWith("/api/")) {
    return;
  }

  if (findPublicRoute(url, event.method)) {
    return;
  }

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

  // Attach user to event context
  event.context.user = payload;
});

declare module "h3" {
  interface H3EventContext {
    user?: AccessTokenPayload;
  }
}
