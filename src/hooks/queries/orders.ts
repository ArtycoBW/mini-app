import { useMutation, useQuery } from "@tanstack/react-query"
import { http } from "@/lib/api"
import type { Product, ApiError422 } from "./catalog"

export type OrderStatus = "pending" | "paid" | "on_moderation" | "completed" | "cancelled"

export type Order = {
  id: number
  user_id: number
  product_id: number
  amount: number
  status: OrderStatus
  payment_id: string | null
  custom_instruction: string | null
  report_article: string | null
  report_submitted_at: string | null
  paid_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  report_reviewed_at: string | null
  report_forwarded_at: string | null
  cashback_sent_at: string | null
  cashback_amount: number
  cashback_comment: string | null
  cashback_transaction_id: string | null
  product: Product
  report_screenshots: string[]
}

export type OrdersPage = {
  orders: Order[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type CreateOrderBody = { product_id: number; custom_instruction?: string | null }
export const useCreateOrder = () =>
  useMutation<Order, ApiError422, CreateOrderBody>({
    mutationFn: (body) => http.post<Order, CreateOrderBody>("/api/orders/", body),
  })

export const useMyOrders = (page = 1, page_size = 20) =>
  useQuery<OrdersPage, ApiError422>({
    queryKey: ["orders-my", page, page_size],
    queryFn: () => http.get<OrdersPage>("/api/orders/my", { params: { page, page_size } }),
  })

export const useOrder = (orderId?: number, enabled = true) =>
  useQuery<Order, ApiError422>({
    queryKey: ["order", orderId],
    queryFn: () => http.get<Order>(`/api/orders/${orderId}`),
    enabled: Boolean(orderId) && enabled,
  })

export const useCancelOrder = () =>
  useMutation<Order, ApiError422, { order_id: number }>({
    mutationFn: ({ order_id }) => http.post<Order, undefined>(`/api/orders/${order_id}/cancel`),
  })

export type UploadReportBody = { report_article: string; screenshot_urls: string[] }
export const useUploadReport = () =>
  useMutation<Order, ApiError422, { order_id: number; body: UploadReportBody }>({
    mutationFn: ({ order_id, body }) => http.post<Order, UploadReportBody>(`/api/orders/${order_id}/report`, body),
  })

export const useOrdersByStatus = (status: OrderStatus, page = 1, page_size = 20) =>
  useQuery<OrdersPage, ApiError422>({
    queryKey: ["orders-by-status", status, page, page_size],
    queryFn: () => http.get<OrdersPage>("/api/orders/by-status", { params: { status, page, page_size } }),
  })
