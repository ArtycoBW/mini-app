/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query"
import { http, token } from "@/lib/api"

export type Role = "buyer" | "seller"
export type SellerType = "ip" | "ooo" | "self_employed"
export type OrderStatus = "pending" | "paid" | "on_moderation" | "completed" | "cancelled"

export type CategoryShort = {
  id: number
  name: string
  slug: string
  description: string
  parent_id: number | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  category_id: number
  subcategory_id: number
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
  payment_id: string
  payment_amount: number
  paid_at: string | null
  views_count: number
  orders_count: number
  created_at: string
  updated_at: string
  images: string[]
  category: CategoryShort
  subcategory: CategoryShort
}

export type Order = {
  id: number
  user_id: number
  product_id: number
  amount: number
  status: OrderStatus
  payment_id: string
  custom_instruction: string
  report_article: string
  report_submitted_at: string | null
  paid_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  report_reviewed_at: string | null
  report_forwarded_at: string | null
  cashback_sent_at: string | null
  cashback_amount: number
  cashback_comment: string
  cashback_transaction_id: string
  product: Product
  report_screenshots: string[]
}

export type MiniappLastUser = {
  user_id: number
  telegram_id: number
  phone: string
  role: Role
  created_at: string
}

export type MiniappStats = {
  total: number
  admins: number
  regulars: number
  last_users: MiniappLastUser[]
}

export const useAdminMiniappStats = () =>
  useQuery<MiniappStats, any>({
    queryKey: ["admin-miniapp-stats"],
    queryFn: () => http.get<MiniappStats>("/api/admin/dashboard/miniapp-stats"),
    enabled: Boolean(token.get()),
  })

export type AdminModerationUser = {
  user_id: number
  telegram_id: number
  username: string
  full_name: string
  phone: string
  role: Role
}

export type AdminModerationItem = {
  order: Order
  buyer: AdminModerationUser
  seller: AdminModerationUser
  time_in_status_hours: number
}

export const useAdminOrdersOnModeration = () =>
  useQuery<AdminModerationItem[], any>({
    queryKey: ["admin-orders-moderation"],
    queryFn: () => http.get<AdminModerationItem[]>("/api/admin/dashboard/orders/moderation"),
    enabled: Boolean(token.get()),
  })

export type ApproveOrderPayload = {
  notify_seller: boolean
  seller_message?: string
  notify_buyer?: boolean
  buyer_message?: string
}

export type AdminOrderActionResponse = {
  order: Order
  buyer_notified: boolean
  seller_notified: boolean
}

export const useAdminApproveOrder = () =>
  useMutation<AdminOrderActionResponse, any, { order_id: number; data: ApproveOrderPayload }>({
    mutationFn: ({ order_id, data }) =>
      http.post<AdminOrderActionResponse, ApproveOrderPayload>(
        `/api/admin/dashboard/orders/${order_id}/approve`,
        data,
      ),
  })

export type CashbackPayload = {
  amount: number
  notify_buyer: boolean
  message?: string
  transaction_id?: string
  comment?: string
}

export const useAdminMarkCashbackSent = () =>
  useMutation<AdminOrderActionResponse, any, { order_id: number; data: CashbackPayload }>({
    mutationFn: ({ order_id, data }) =>
      http.post<AdminOrderActionResponse, CashbackPayload>(
        `/api/admin/dashboard/orders/${order_id}/cashback`,
        data,
      ),
  })

export type OrderMessageRecipient = "buyer" | "seller"

export type OrderMessagePayload = {
  recipient: OrderMessageRecipient
  message: string
}

export const useAdminSendOrderMessage = () =>
  useMutation<AdminOrderActionResponse, any, { order_id: number; data: OrderMessagePayload }>({
    mutationFn: ({ order_id, data }) =>
      http.post<AdminOrderActionResponse, OrderMessagePayload>(
        `/api/admin/dashboard/orders/${order_id}/message`,
        data,
      ),
  })

export type ActiveOrderStat = {
  order_id: number
  product_id: number
  product_name: string
  buyer_id: number
  buyer_name: string
  buyer_phone: string
  status: OrderStatus
  since: string
  hours_in_status: number
}

export type CompletedProductBuyer = {
  buyer_id: number
  buyer_name: string
  completed_at: string
}

export type CompletedProductStat = {
  product_id: number
  product_name: string
  completed_count: number
  buyers: CompletedProductBuyer[]
}

export type UnpurchasedProductStat = {
  product_id: number
  product_name: string
  quantity: number
  created_at: string
  seller_id: number
  seller_name: string
}

export type ProductsStats = {
  active_orders: ActiveOrderStat[]
  completed_products: CompletedProductStat[]
  unpurchased_products: UnpurchasedProductStat[]
}

export const useAdminProductsStats = () =>
  useQuery<ProductsStats, any>({
    queryKey: ["admin-products-stats"],
    queryFn: () => http.get<ProductsStats>("/api/admin/dashboard/products/stats"),
    enabled: Boolean(token.get()),
  })

export type AdminBuyer = {
  id: number
  user_id: number
  full_name: string
  email: string
  phone: string
  telegram_id: number
  username: string
  created_at: string
  subscription_active: boolean
}

export const useAdminBuyers = () =>
  useQuery<AdminBuyer[], any>({
    queryKey: ["admin-buyers"],
    queryFn: () => http.get<AdminBuyer[]>("/api/admin/dashboard/users/buyers"),
    enabled: Boolean(token.get()),
  })

export type AdminSellerListItem = {
  id: number
  user_id: number
  seller_type: SellerType
  organization_name: string
  inn: string
  phone: string
  telegram_id: number
  username: string
  created_at: string
}

export const useAdminSellers = (seller_type?: SellerType) =>
  useQuery<AdminSellerListItem[], any>({
    queryKey: ["admin-sellers", seller_type],
    queryFn: () =>
      http.get<AdminSellerListItem[]>(
        "/api/admin/dashboard/users/sellers",
        {
          params: seller_type ? { seller_type } : undefined
        }
      ),
    enabled: Boolean(token.get()),
  })


export type AdminSellerDetails = {
  seller: {
    id: number
    user_id: number
    seller_type: SellerType
    organization_name: string
    inn: string
    phone: string
    telegram_id: number
    username: string
    created_at: string
  }
  products: {
    product_id: number
    name: string
    article: string
    created_at: string
    is_active: boolean
    quantity: number
  }[]
}

export const useAdminSellerDetails = (seller_id: number | null) =>
  useQuery<AdminSellerDetails, any>({
    queryKey: ["admin-seller-details", seller_id],
    queryFn: () => http.get<AdminSellerDetails>(`/api/admin/dashboard/sellers/${seller_id}`),
    enabled: Boolean(token.get()) && seller_id != null,
  })
