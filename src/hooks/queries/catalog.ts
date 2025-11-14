/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@/hooks/queries/categories"
import { http } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export type ProductImage = {
  id?: number
  image_url: string
  sort_order: number
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
  payment_amount: number
  paid_at: string | null
  views_count: number
  orders_count: number
  created_at: string
  updated_at: string
  images: ProductImage[]
  category?: Category
  subcategory?: Category
}

export type CatalogSearchFilters = {
  category_id?: number
  subcategory_id?: number
  marketplace?: string
  min_price?: number
  max_price?: number
  min_cashback_percent?: number
  max_cashback_percent?: number
  only_active?: boolean
}

export type CatalogSortOrder = "asc" | "desc"

export type CatalogSearchRequest = {
  query?: string
  filters?: CatalogSearchFilters
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: CatalogSortOrder
}

export type CatalogSearchResponse = {
  products: Product[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export const useCatalogSearch = (params: CatalogSearchRequest) =>
  useQuery<CatalogSearchResponse, any>({
    queryKey: ["catalog-search", params],
    queryFn: () => http.post<CatalogSearchResponse, CatalogSearchRequest>("/api/catalog/search", params),
  })

export const useCatalogProduct = (productId?: number) =>
  useQuery<Product, any>({
    queryKey: ["catalog-product", productId],
    queryFn: () => http.get<Product>(`/api/catalog/${productId}`),
    enabled: Boolean(productId),
  })
