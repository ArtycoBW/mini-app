/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query"
import { http } from "@/lib/api"
import type { Product } from "@/hooks/queries/catalog"
import type { Order } from "@/hooks/queries/orders"

export type CartItem = {
  id: number
  cart_id: number
  product_id: number
  custom_instruction: string | null
  added_at: string
  product: Product
}

export type Cart = {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  items: CartItem[]
}

export type CartAddItemInput = {
  product_id: number
  custom_instruction?: string
}

export type CartCheckoutResponse = {
  orders: Order[]
  total_amount: number
}

export const useCart = () =>
  useQuery<Cart, any>({
    queryKey: ["cart"],
    queryFn: () => http.get<Cart>("/api/cart/"),
  })

export const useCartClear = () =>
  useMutation<string, any>({
    mutationFn: () => http.delete<string>("/api/cart/"),
  })

export const useCartAddItem = () =>
  useMutation<CartItem, any, CartAddItemInput>({
    mutationFn: (data) => http.post<CartItem, CartAddItemInput>("/api/cart/items", data),
  })

export const useCartRemoveItem = () =>
  useMutation<string, any, { item_id: number }>({
    mutationFn: (vars) => http.delete<string>(`/api/cart/items/${vars.item_id}`),
  })

export const useCartCheckout = () =>
  useMutation<CartCheckoutResponse, any>({
    mutationFn: () => http.post<CartCheckoutResponse, Record<string, never>>("/api/cart/checkout", {}),
  })

export const useCartItemCheckout = () =>
  useMutation<Order, any, { item_id: number }>({
    mutationFn: (vars) =>
      http.post<Order, Record<string, never>>(`/api/cart/items/${vars.item_id}/checkout`, {}),
  })
