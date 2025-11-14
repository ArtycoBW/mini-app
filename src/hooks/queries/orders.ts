/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query"
import { http, token } from "@/lib/api"

export type OrderStatus =
  | "pending"
  | "paid"
  | "on_moderation"
  | "completed"
  | "cancelled"

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  parent_id: number
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  category_id: number
  subcategory_id: number | null
  seller_id: number
  marketplace: string
  article: string
  name: string
  short_description: string
  quantity: number
  marketplace_price: number
  cashback_amount: number
  buyer_price: number
  purchase_instruction: string
  return_type: string
  return_days: number
  is_active: boolean
  payment_id: string | null
  payment_amount: number | null
  paid_at: string | null
  views_count: number
  orders_count: number
  created_at: string
  updated_at: string
  images: string[]
  category: Category
  subcategory: Category | null
}

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

export type OrdersListResponse = {
  orders: Order[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type CreateOrderBody = {
  product_id: number
  custom_instruction?: string
}

export type SubmitOrderReportBody = {
  report_article: string
  screenshot_urls: string[]
}

export type MyOrdersParams = {
  page?: number
  page_size?: number
}

export type OrdersByStatusParams = {
  status: OrderStatus
  page?: number
  page_size?: number
}

export type AdminOrdersParams = {
  status_filter?: OrderStatus
  page?: number
  page_size?: number
}

const clean = <T extends Record<string, any>>(obj: T): T => {
  const out: Record<string, any> = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (v !== undefined && v !== null && v !== "") out[k] = v
  })
  return out as T
}

export const useCreateOrder = () =>
  useMutation<Order, any, CreateOrderBody>({
    mutationFn: (body) =>
      http.post<Order, CreateOrderBody>("/api/orders/", clean(body)),
  })

export const useMyOrders = (params?: MyOrdersParams) =>
  useQuery<OrdersListResponse, any>({
    queryKey: ["orders-my", params],
    queryFn: () =>
      http.get<OrdersListResponse>("/api/orders/my", {
        params: params ? clean(params) : undefined,
      }),
    enabled: Boolean(token.get()),
  })

export const useOrder = (orderId?: number) =>
  useQuery<Order, any>({
    queryKey: ["order", orderId],
    queryFn: () => http.get<Order>(`/api/orders/${orderId as number}`),
    enabled: Boolean(token.get()) && !!orderId,
  })

export const useCancelOrder = () =>
  useMutation<Order, any, { order_id: number }>({
    mutationFn: ({ order_id }) =>
      http.post<Order, Record<string, never>>(
        `/api/orders/${order_id}/cancel`,
        {} as Record<string, never>,
      ),
  })

export const useSubmitOrderReport = () =>
  useMutation<Order, any, { order_id: number; data: SubmitOrderReportBody }>({
    mutationFn: ({ order_id, data }) =>
      http.post<Order, SubmitOrderReportBody>(
        `/api/orders/${order_id}/report`,
        clean(data),
      ),
  })

export const useOrdersByStatus = (params: OrdersByStatusParams) =>
  useQuery<OrdersListResponse, any>({
    queryKey: ["orders-by-status", params],
    queryFn: () =>
      http.get<OrdersListResponse>("/api/orders/by-status", {
        params: clean(params),
      }),
    enabled: Boolean(token.get()),
  })

export const useAdminOrders = (params?: AdminOrdersParams) =>
  useQuery<OrdersListResponse, any>({
    queryKey: ["orders-admin-all", params],
    queryFn: () =>
      http.get<OrdersListResponse>("/api/orders/admin/all", {
        params: params ? clean(params) : undefined,
      }),
    enabled: Boolean(token.get()),
  })

export const useAdminCompleteOrder = () =>
  useMutation<Order, any, { order_id: number }>({
    mutationFn: ({ order_id }) =>
      http.post<Order, Record<string, never>>(
        `/api/orders/admin/${order_id}/complete`,
        {} as Record<string, never>,
      ),
  })
