export interface ApiClientOptions {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

function serializeQueryParams(
  params: Record<string, string | number | boolean> = {},
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function createApiClient({
  baseURL = "",
  defaultHeaders = {},
}: ApiClientOptions = {}) {
  const normalizedBaseURL = baseURL.replace(/\/$/, "");

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${normalizedBaseURL}${path}`;
    // const headers = {
    //   "Content-Type": "application/json",
    //   ...defaultHeaders,
    //   ...Object.fromEntries(
    //     init.headers instanceof Headers
    //       ? Array.from(init.headers.entries())
    //       : (init.headers ?? []),
    //   ),
    // };

    const initHeaders =
      init.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : Array.isArray(init.headers)
          ? Object.fromEntries(init.headers)
          : (init.headers ?? {});

    const headers = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...initHeaders,
    };

    const response = await fetch(url, {
      ...init,
      headers,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  function get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ) {
    const query = params ? serializeQueryParams(params) : "";
    return request<T>(`${path}${query}`, { method: "GET" });
  }

  function post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body == null ? undefined : JSON.stringify(body),
    });
  }

  function put<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body == null ? undefined : JSON.stringify(body),
    });
  }

  function del<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "DELETE",
      body: body == null ? undefined : JSON.stringify(body),
    });
  }

  return {
    get,
    post,
    put,
    delete: del,
  };
}

export const apiClient = createApiClient({ baseURL: "" });
