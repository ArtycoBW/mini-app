import axios, { type AxiosRequestConfig } from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const TOKEN_KEY = "auth_token"

export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const t = token.get()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e?.response?.status === 401) token.clear()
    return Promise.reject(e)
  }
)

const request = async <T, B = unknown>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: B,
  config?: AxiosRequestConfig
) => {
  const res = await api.request<T>({ method, url, data, ...config })
  return res.data
}

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("get", url, undefined, config),
  post: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T, B>("post", url, body, config),
  put: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T, B>("put", url, body, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("delete", url, undefined, config),
}
