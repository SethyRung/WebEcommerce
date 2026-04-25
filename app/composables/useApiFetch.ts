import type { FetchResponse } from "ofetch";

let isRefreshing = false;
let refreshPromise: Promise<FetchResponse<ApiResponse<unknown>>> | null = null;

export const useApiFetch = createUseFetch((options) => {
  const config = useRuntimeConfig();
  const event = useRequestEvent();

  return {
    baseURL: config.public.baseURL,
    timeout: 10000,
    onResponse: async (context) => {
      if (!context.response.ok) return;

      const data = context.response._data as ApiResponse<unknown>;
      if (data?.status?.code !== ApiResponseCode.Unauthorized) return;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = $fetch
          .raw("/api/auth/refresh", {
            baseURL: config.public.baseURL,
            method: "POST",
            timeout: 10000,
            headers: { cookie: getCookieHeader(context.options) },
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      const refreshRes = await refreshPromise;
      if (!refreshRes) return;

      if (refreshRes._data?.status?.code !== ApiResponseCode.Success) return;

      forwardCookies(event, refreshRes);

      const retryRes = await $fetch.raw(context.request, {
        ...context.options,
        onResponse: undefined,
        method: context.options.method as any,
        headers: {
          ...context.options.headers,
          cookie: getCookieHeader(refreshRes),
        },
      });

      context.response = retryRes;
    },
    ...options,
  };
});
