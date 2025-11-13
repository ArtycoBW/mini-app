/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query"
import { http, token } from "@/lib/api"

export type Role = "buyer" | "seller"

type SendCodeVars = { phone_number: string }
type VerifyVars = { phone_number: string; code: string; role: Role }
type VerifyResp = {
  access_token: string
  token_type: string
  user_id: number
  phone_number: string
  is_new_user: boolean
}

export const verifiedPhone = {
  get: () => localStorage.getItem("verified_phone") || "",
  set: (v: string) => localStorage.setItem("verified_phone", v),
  clear: () => localStorage.removeItem("verified_phone"),
}

export const selectedRole = {
  get: () => (localStorage.getItem("selected_role") as Role) || "buyer",
  set: (r: Role) => localStorage.setItem("selected_role", r),
  clear: () => localStorage.removeItem("selected_role"),
}

export const useSendCode = () =>
  useMutation({ mutationFn: (vars: SendCodeVars) => http.post<void, SendCodeVars>("/api/auth/phone/send-code", vars) })

export const useVerifyCode = () =>
  useMutation({
    mutationFn: async (vars: VerifyVars) => {
      const res = await http.post<VerifyResp, VerifyVars>("/api/auth/phone/verify-code", vars)
      token.set(res.access_token)
      verifiedPhone.set(vars.phone_number)
      selectedRole.set(vars.role)
      return res
    },
  })

export type SellerType = "ip" | "ooo" | "self_employed"

export type RegistrationBuyer = {
  role: "buyer"
  phone: string
  full_name: string
  email: string
  terms_accepted: boolean
}

type RegisterSellerBase = {
  role: "seller"
  phone: string
  seller_type: SellerType
  organization_name: string
  inn: string
  legal_address?: string
  bank_account: string
  correspondent_account: string
  bik: string
  bank_name: string
  offer_accepted: boolean
  terms_accepted: boolean
}

export type RegistrationSellerIP = RegisterSellerBase & {
  seller_type: "ip"
  ogrn: string
  legal_address: string
  kpp?: never
}

export type RegistrationSellerOOO = RegisterSellerBase & {
  seller_type: "ooo"
  kpp: string
  ogrn?: string
}

export type RegistrationSellerSelf = RegisterSellerBase & {
  seller_type: "self_employed"
  ogrn?: never
  kpp?: never
}

export type RegistrationPayload =
  | RegistrationBuyer
  | RegistrationSellerIP
  | RegistrationSellerOOO
  | RegistrationSellerSelf

type RegisterResp = { user: { role: Role }; buyer: unknown | null; seller: unknown | null }

const clean = <T extends Record<string, any>>(obj: T): T => {
  const out: Record<string, any> = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (v !== undefined && v !== null && v !== "") out[k] = v
  })
  return out as T
}

export const useRegister = () =>
  useMutation<RegisterResp, any, RegistrationPayload>({
    mutationFn: (payload) => http.post<RegisterResp, RegistrationPayload>("/api/registration/register", clean(payload)),
  })

export type SellerProfile = {
  id: number
  seller_type: SellerType
  organization_name: string
  inn: string
  phone: string
  ogrn?: string | null
  kpp?: string | null
  legal_address: string
  bank_account: string
  correspondent_account: string
  bik: string
  bank_name: string
  offer_accepted: boolean
  offer_accepted_at: string | null
  created_at: string
}

export const useSellerMe = () =>
  useQuery<SellerProfile, any>({
    queryKey: ["seller-me"],
    queryFn: () => http.get<SellerProfile>("/api/registration/seller/me"),
    enabled: Boolean(token.get()),
  })
