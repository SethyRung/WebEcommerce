export const useApiFetch = createUseFetch((options) => {
  const config = useRuntimeConfig();
  const REFRESH_TOKEN_ENDPOINT = "/api/auth/refresh";
  const event = import.meta.server ? useRequestEvent() : null;

  function forwardCookiesToClient(setCookieHeaders: string[]) {
    if (event) {
      for (const cookie of setCookieHeaders) {
        appendHeader(event, "set-cookie", cookie);
      }
    }
  }

  return {
    baseURL: config.public.baseURL,
    timeout: 10000,
    onResponse: async (context) => {
      if (context.response.ok) {
        const cookies = context.response.headers.getSetCookie();
        forwardCookiesToClient(cookies);

        const data = context.response._data as ApiResponse<unknown>;
        if (data.status.code === ApiResponseCode.Unauthorized) {
          const refreshTokenRes = await $fetch.raw(REFRESH_TOKEN_ENDPOINT, {
            baseURL: config.public.baseURL,
            method: "POST",
            headers: {
              cookie: context.options.headers.get("cookie") || "",
            },
          });

          if (
            !refreshTokenRes._data ||
            refreshTokenRes._data.status.code !== ApiResponseCode.Success
          ) {
            return;
          }

          const refreshCookies = refreshTokenRes.headers.getSetCookie();

          const cookies = refreshCookies.join("; ");
          const repeatOptions = {
            ...context.options,
            onResponse: undefined,
            headers: {
              ...context.options.headers,
              cookie: cookies,
            },
          };

          const repeatRes = await $fetch.raw(context.request, repeatOptions as any);
          const repeatCookies = repeatRes.headers.getSetCookie();

          forwardCookiesToClient([...refreshCookies, ...repeatCookies]);

          context.response._data = repeatRes._data;
        }
      }
    },
    ...options,
  };
});
