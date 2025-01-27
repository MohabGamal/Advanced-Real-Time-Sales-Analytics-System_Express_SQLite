import { useState } from "react";

interface UseFetchOptions<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: T;
}

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  fetchApi: (url: string, options?: UseFetchOptions<any>) => Promise<void>;
}

function useFetch<T = unknown>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchApi = async (url: string, options?: UseFetchOptions<any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options?.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = (await response.json()) as T;
      setData(responseData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fetchApi };
}

export default useFetch;
