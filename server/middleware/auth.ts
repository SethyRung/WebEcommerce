export default defineEventHandler((event) => {
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
