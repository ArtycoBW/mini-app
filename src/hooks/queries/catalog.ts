import { useQuery } from "@tanstack/react-query"
import { http } from "@/lib/api"

export type Category = {
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

export type ProductImage = { url: string; id?: number }

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
  return_type: "returnable" | "non_returnable" | string
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
  category: Category
  subcategory: Category
}

export type ApiError422 = { detail: Array<{ loc: (string | number)[]; msg: string; type: string }> }

export type CatalogSearchParams = {
  query?: string
  marketplace?: string
  category_id?: number
  subcategory_id?: number
  min_price?: number
  max_price?: number
  page?: number
  page_size?: number
  [key: string]: unknown
}

export type CatalogSearchResp = {
  products: Product[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export const useCatalogSearch = (params: CatalogSearchParams) =>
  useQuery<CatalogSearchResp, ApiError422>({
    queryKey: ["catalog-search", params],
    queryFn: () => http.get<CatalogSearchResp>("/api/catalog/search", { params }),
  })

export const useProduct = (productId?: number, enabled = true) =>
  useQuery<Product, ApiError422>({
    queryKey: ["product", productId],
    queryFn: () => http.get<Product>(`/api/catalog/${productId}`),
    enabled: Boolean(productId) && enabled,
  })
