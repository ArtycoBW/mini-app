/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister, type SellerType } from "@/hooks/queries/auth"
import { verifiedPhone } from "@/hooks/queries/auth"
import { format8 } from "@/lib/phone"
import BubblesBackground from "@/components/BubblesBackground"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigate } from "react-router-dom"

const d = (len: number, label: string) => z.string().regex(new RegExp(`^\\d{${len}}$`), `${label}: ${len} цифр`)
const phoneRu = z.string().regex(/^8\d{10}$/, "Телефон: 8XXXXXXXXXX")

const baseSchema = z.object({
  phone: phoneRu,
  organization_name: z.string().min(2),
  legal_address: z.string().min(5),
  bank_account: d(20, "Расчётный счёт"),
  correspondent_account: d(20, "Корр. счёт"),
  bik: d(9, "БИК"),
  bank_name: z.string().min(2),
})

const ipSchema = z.object({ seller_type: z.literal("ip"), inn: d(12, "ИНН"), ogrn: d(15, "ОГРНИП") }).merge(baseSchema)
const oooSchema = z.object({ seller_type: z.literal("ooo"), inn: d(10, "ИНН"), kpp: d(9, "КПП") }).merge(baseSchema)
const selfSchema = z.object({ seller_type: z.literal("self_employed"), inn: d(12, "ИНН") }).merge(baseSchema)
const sellerSchema = z.discriminatedUnion("seller_type", [ipSchema, oooSchema, selfSchema])
type FormData = z.infer<typeof sellerSchema>

export default function SellerRegister() {
  const nav = useNavigate()
  const registerUser = useRegister()
  const [type, setType] = useState<SellerType>("ip")

  const { control, handleSubmit, setValue, formState, watch } = useForm<FormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      seller_type: type,
      phone: verifiedPhone.get() || "8",
      organization_name: "",
      inn: "",
      ogrn: "",
      kpp: "",
      legal_address: "",
      bank_account: "",
      correspondent_account: "",
      bik: "",
      bank_name: "",
    } as FormData,
    mode: "onChange",
  })

  useEffect(() => {
    setValue("seller_type", type as any)
  }, [type, setValue])

  const onSubmit = async (d: FormData) => {
    if (d.seller_type === "ip") {
      await registerUser.mutateAsync({
        role: "seller",
        phone: d.phone,
        seller_type: "ip",
        organization_name: d.organization_name,
        inn: d.inn,
        ogrn: (d as any).ogrn,
        legal_address: d.legal_address,
        bank_account: d.bank_account,
        correspondent_account: d.correspondent_account,
        bik: d.bik,
        bank_name: d.bank_name,
        offer_accepted: true,
        terms_accepted: true,
      })
    } else if (d.seller_type === "ooo") {
      await registerUser.mutateAsync({
        role: "seller",
        phone: d.phone,
        seller_type: "ooo",
        organization_name: d.organization_name,
        inn: d.inn,
        kpp: (d as any).kpp,
        legal_address: d.legal_address,
        bank_account: d.bank_account,
        correspondent_account: d.correspondent_account,
        bik: d.bik,
        bank_name: d.bank_name,
        offer_accepted: true,
        terms_accepted: true,
      })
    } else {
      await registerUser.mutateAsync({
        role: "seller",
        phone: d.phone,
        seller_type: "self_employed",
        organization_name: d.organization_name,
        inn: d.inn,
        legal_address: d.legal_address,
        bank_account: d.bank_account,
        correspondent_account: d.correspondent_account,
        bik: d.bik,
        bank_name: d.bank_name,
        offer_accepted: true,
        terms_accepted: true,
      })
    }
    nav("/seller", { replace: true })
  }

  const err = formState.errors as any
  const t = watch("seller_type")

  return (
    <div className="fixed inset-0">
      <BubblesBackground />
      <div
        className="grid h-full place-items-center px-4"
        style={{ height: "var(--tg-viewport-stable-height, 100vh)" }}
      >
        <Card className="w-full max-w-[680px] shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Регистрация продавца</CardTitle>
            <CardDescription className="text-base">Выберите форму и заполните данные</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <RadioGroup value={type} onValueChange={(v) => setType(v as SellerType)} className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 rounded-2xl border p-3">
                  <RadioGroupItem value="ooo" id="ooo" />
                  <Label htmlFor="ooo">ООО</Label>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border p-3">
                  <RadioGroupItem value="ip" id="ip" />
                  <Label htmlFor="ip">ИП</Label>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border p-3">
                  <RadioGroupItem value="self_employed" id="self" />
                  <Label htmlFor="self">Самозанятость</Label>
                </div>
              </RadioGroup>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 md:col-span-2">
                <Label>Телефон</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        className="h-12 text-base"
                        value={useMemo(() => format8(field.value).formatted, [field.value])}
                        onChange={(e) => setValue("phone", format8(e.target.value).digits, { shouldValidate: true })}
                        placeholder="8-900-123-45-67"
                        inputMode="tel"
                        aria-invalid={!!err.phone}
                      />
                      {err.phone?.message && <div className="text-xs text-red-600">{err.phone.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{t === "ip" ? "Наименование ИП" : t === "ooo" ? "Наименование ООО" : "ФИО"}</Label>
                <Controller
                  control={control}
                  name="organization_name"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" aria-invalid={!!err.organization_name} />
                      {err.organization_name?.message && <div className="text-xs text-red-600">{err.organization_name.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>ИНН</Label>
                <Controller
                  control={control}
                  name="inn"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.inn} />
                      {err.inn?.message && <div className="text-xs text-red-600">{err.inn.message}</div>}
                    </>
                  )}
                />
              </div>

              {t === "ip" && (
                <div className="space-y-2">
                  <Label>ОГРНИП</Label>
                  <Controller
                    control={control}
                    name="ogrn"
                    render={({ field }) => (
                      <>
                        <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.ogrn} />
                        {err.ogrn?.message && <div className="text-xs text-red-600">{err.ogrn.message}</div>}
                      </>
                    )}
                  />
                </div>
              )}

              {t === "ooo" && (
                <div className="space-y-2">
                  <Label>КПП</Label>
                  <Controller
                    control={control}
                    name="kpp"
                    render={({ field }) => (
                      <>
                        <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.kpp} />
                        {err.kpp?.message && <div className="text-xs text-red-600">{err.kpp.message}</div>}
                      </>
                    )}
                  />
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label>Юридический адрес</Label>
                <Controller
                  control={control}
                  name="legal_address"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" aria-invalid={!!err.legal_address} />
                      {err.legal_address?.message && <div className="text-xs text-red-600">{err.legal_address.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Расчётный счёт</Label>
                <Controller
                  control={control}
                  name="bank_account"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.bank_account} />
                      {err.bank_account?.message && <div className="text-xs text-red-600">{err.bank_account.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Корр. счёт</Label>
                <Controller
                  control={control}
                  name="correspondent_account"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.correspondent_account} />
                      {err.correspondent_account?.message && <div className="text-xs text-red-600">{err.correspondent_account.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>БИК банка</Label>
                <Controller
                  control={control}
                  name="bik"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" inputMode="numeric" aria-invalid={!!err.bik} />
                      {err.bik?.message && <div className="text-xs text-red-600">{err.bik.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Наименование банка</Label>
                <Controller
                  control={control}
                  name="bank_name"
                  render={({ field }) => (
                    <>
                      <Input {...field} className="h-12 text-base" aria-invalid={!!err.bank_name} />
                      {err.bank_name?.message && <div className="text-xs text-red-600">{err.bank_name.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-violet-500 text-base text-white" type="submit">
                  Завершить регистрацию
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
