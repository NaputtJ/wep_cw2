/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import router from "../router"
import { buildWebStorage, setupCache } from "axios-cache-interceptor";

// export const serverRoute = "http://127.0.0.1:5000/"
export const serverRoute = "./"
export const fileRoute = serverRoute + "files/"

export type ApiResponse<T = any> = {
  status?: boolean,
  data?: T
  err?: any
}

type CacheAxiosRequestConfig = AxiosRequestConfig & {
  cache?: boolean
}

export class ApiInstance {
  private axios: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance
  }

  checkMissionJWT(err: AxiosError): boolean {
    if (err.status === 401) {
      if (err.response?.data == null || typeof err.response?.data !== "object") {
        return false
      }

      if (Object.prototype.hasOwnProperty.call(err.response.data, "msg")) {
        if (typeof (err.response.data as any).msg! === "string") {
          if ((err.response.data as any).msg!.includes("Missing cookie") ||
            (err.response.data as any).msg!.includes("Token has expired")) {
            return true
          }
        }
      }
    }

    return false
  }

  async token_refresh(): Promise<boolean> {
    try {
      const res = await this.axios.post<ApiResponse>("/token/refresh")
      return res.data.status ?? false
    } catch (_err: any) {
      return false
    }
  }

  async get<T = any>(url: string, config?: CacheAxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.get<ApiResponse<T>>(url, config)
      if ((config as any)?.cache == null || !(config as any)?.cache) {
        await (this.axios as any).storage.remove((res as any).id)
      }
      return res.data
    } catch (err: any) {
      if (this.checkMissionJWT(err)) {
        if (await this.token_refresh()) {
          try {
            const res = await this.axios.get<ApiResponse<T>>(url, config)
            if ((config as any)?.cache == null || !(config as any)?.cache) {
              await (this.axios as any).storage.remove((res as any).id)
            }
            return res.data
          } catch (_err) { /* empty */ }
        } else {
          router.navigate('/login')
        }
      }

      return {
        status: false,
        err: err,
      }
    }
  }

  async post<T = any, D = any>(url: string, data?: D, config?: CacheAxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.post<ApiResponse<T>>(url, data, config)
      return res.data
    } catch (err: any) {
      if (this.checkMissionJWT(err)) {
        if (await this.token_refresh()) {
          try {
            const res = await this.axios.post<ApiResponse<T>>(url, data, config)
            return res.data
          } catch (_err) { /* empty */ }
        } else {
          router.navigate('/login')
        }
      }

      return {
        status: false,
        err: err,
      }
    }
  }
}

function initAxios() {
  const instance = axios.create({
    baseURL: serverRoute,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  const axiosInstance = setupCache(instance, {
    storage: buildWebStorage(sessionStorage, 'axios-cache:'),
  })

  axiosInstance.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return new ApiInstance(axiosInstance)
}

export default initAxios

