/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export type CategoryCreatePayload = {
  name: string
  slug: string
  description?: string
  parent_id?: number | null
  sort_order?: number
  is_active?: boolean
}

export type CategoryUpdatePayload = {
  name?: string
  slug?: string
  description?: string
  sort_order?: number
  is_active?: boolean
}

export type CategoryListParams = {
  parent_id?: number
  only_active?: boolean
  include_children?: boolean
}

export type CategoryListResponse = {
  categories: Category[]
  total: number
}

export const useCategories = (params?: CategoryListParams) =>
  useQuery<CategoryListResponse, any>({
    queryKey: ["categories", params],
    queryFn: () =>
      http.get<CategoryListResponse>("/api/categories", {
        params: {
          parent_id: params?.parent_id,
          only_active: params?.only_active ?? true,
          include_children: params?.include_children ?? false,
        },
      }),
  })

export const useCategory = (categoryId?: number) =>
  useQuery<Category, any>({
    queryKey: ["category", categoryId],
    queryFn: () => http.get<Category>(`/api/categories/${categoryId}`),
    enabled: typeof categoryId === "number",
  })

export const useCategoryBySlug = (slug?: string) =>
  useQuery<Category, any>({
    queryKey: ["category-by-slug", slug],
    queryFn: () => http.get<Category>(`/api/categories/by-slug/${slug}`),
    enabled: Boolean(slug),
  })

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation<Category, any, CategoryCreatePayload>({
    mutationFn: (payload) => http.post<Category, CategoryCreatePayload>("/api/categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export const useUpdateCategory = (categoryId: number) => {
  const qc = useQueryClient()
  return useMutation<Category, any, CategoryUpdatePayload>({
    mutationFn: (payload) =>
      http.put<Category, CategoryUpdatePayload>(`/api/categories/${categoryId}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
      qc.invalidateQueries({ queryKey: ["category", categoryId] })
    },
  })
}

export const useDeleteCategory = (categoryId: number) => {
  const qc = useQueryClient()
  return useMutation<string, any, void>({
    mutationFn: () => http.delete<string>(`/api/categories/${categoryId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
      qc.invalidateQueries({ queryKey: ["category", categoryId] })
    },
  })
}
