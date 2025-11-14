/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { http } from "@/lib/api"
import type { Category } from "./categories"

export type ProductReturnType = string

export type AdminProductImage = {
  id?: number
  image_url: string
  created_at?: string
  updated_at?: string
}

export type AdminProduct = {
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
  return_type: ProductReturnType
  return_days: number
  is_active: boolean
  payment_id: string | null
  payment_amount: number
  paid_at: string | null
  views_count: number
  orders_count: number
  created_at: string
  updated_at: string
  images: AdminProductImage[]
  category: Category
  subcategory: Category | null
}

export type AdminProductInputImage = {
  image_url: string
}

export type AdminProductPayload = {
  category_id: number
  subcategory_id?: number | null
  seller_id?: number
  marketplace: string
  article: string
  name: string
  short_description: string
  quantity: number
  marketplace_price: number
  cashback_amount: number
  buyer_price: number
  purchase_instruction: string
  return_type: ProductReturnType
  return_days: number
  is_active: boolean
  images?: AdminProductInputImage[]
  payment_return_url?: string
  sort_order?: number
}

export type CreateAdminProductResponse = {
  product: AdminProduct
  payment_id: string
  payment_url: string
  amount: number
}

export const useAdminProduct = (productId?: number) =>
  useQuery<AdminProduct, any>({
    queryKey: ["admin-product", productId],
    queryFn: () => http.get<AdminProduct>(`/api/admin/products/${productId}`),
    enabled: typeof productId === "number",
  })

export const useCreateAdminProduct = () => {
  const qc = useQueryClient()
  return useMutation<CreateAdminProductResponse, any, AdminProductPayload>({
    mutationFn: (payload) =>
      http.post<CreateAdminProductResponse, AdminProductPayload>("/api/admin/products/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] })
    },
  })
}

export const useUpdateAdminProduct = (productId: number) => {
  const qc = useQueryClient()
  return useMutation<AdminProduct, any, Partial<AdminProductPayload>>({
    mutationFn: (payload) =>
      http.put<AdminProduct, Partial<AdminProductPayload>>(
        `/api/admin/products/${productId}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] })
      qc.invalidateQueries({ queryKey: ["admin-products"] })
    },
  })
}

export const useDeleteAdminProduct = (productId: number) => {
  const qc = useQueryClient()
  return useMutation<string, any, void>({
    mutationFn: () => http.delete<string>(`/api/admin/products/${productId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] })
      qc.invalidateQueries({ queryKey: ["admin-products"] })
    },
  })
}
