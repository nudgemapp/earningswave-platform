import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private tokenGetter: (() => Promise<string | null>) | null = null;

  private constructor(baseURL: string = "/api") {
    this.axiosInstance = axios.create({ baseURL });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.tokenGetter) {
          const token = await this.tokenGetter();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setTokenGetter(getter: () => Promise<string | null>): void {
    this.tokenGetter = getter;
  }

  async request<T = any>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.request<T>({ method, url, ...config });
    } catch (error) {
      console.error(
        `Error in ${method.toUpperCase()} request to ${url}:`,
        error
      );
      throw error;
    }
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request("get", url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request("post", url, { ...config, data });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request("put", url, { ...config, data });
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request("patch", url, { ...config, data });
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request("delete", url, config);
  }
}

export const useApiClient = (): ApiClient => {
  const { getToken } = useAuth();

  const apiClient = useMemo(() => {
    const client = ApiClient.getInstance();
    client.setTokenGetter(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    });
    return client;
  }, [getToken]);

  return apiClient;
};

export default ApiClient.getInstance();
