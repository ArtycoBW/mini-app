/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSendCode, useVerifyCode, selectedRole } from "@/hooks/queries/auth"
import { format8 } from "@/lib/phone"
import BubblesBackground from "@/components/BubblesBackground"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useNavigate } from "react-router-dom"

const phoneSchema = z
  .string()
  .min(1)
  .transform((v) => format8(v).digits)
  .refine((v) => /^8\d{10}$/.test(v), "Номер должен начинаться с 8 и содержать 11 цифр")

const schema = z.object({
  phone: phoneSchema,
  role: z.enum(["buyer", "seller"]),
  code: z.string().min(4).max(6).optional(),
})

export default function AuthScreen() {
  const [codeSent, setCodeSent] = useState(false)
  const sendCode = useSendCode()
  const verifyCode = useVerifyCode()
  const nav = useNavigate()

  const { control, handleSubmit, setValue, getValues, watch, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: selectedRole.get(), phone: "8", code: "" },
    mode: "onChange",
  })

  const onSend = async () => {
    const digits = format8(getValues("phone")).digits
    await sendCode.mutateAsync({ phone_number: digits })
    setCodeSent(true)
  }

  const onVerify = async (d: z.infer<typeof schema>) => {
    const res = await verifyCode.mutateAsync({
      phone_number: d.phone!,
      code: d.code!,
      role: d.role,
    })
    if (res.is_new_user) {
      if (d.role === "seller") nav("/register/seller", { replace: true })
      else nav("/register/buyer", { replace: true })
      return
    }
    nav(d.role === "seller" ? "/seller" : "/buyer", { replace: true })
  }

  const err = formState.errors as any
  const role = watch("role")

  return (
    <div className="fixed inset-0">
      <BubblesBackground />
      <div
        className="grid h-full place-items-center px-4"
        style={{ height: "var(--tg-viewport-stable-height, 100svh)" }}
      >
        <Card className="w-full max-w-[680px] shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-emerald-700">АтмоСфера</CardTitle>
            <CardDescription className="text-lg">Вход по номеру телефона</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit(onVerify)}>
              <div className="space-y-2">
                <Label className="text-base">Номер телефона</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        className="h-14 text-lg"
                        value={useMemo(() => format8(field.value).formatted, [field.value])}
                        onChange={(e) => setValue("phone", format8(e.target.value).digits, { shouldValidate: true })}
                        placeholder="8-900-123-45-67"
                        inputMode="tel"
                      />
                      {err.phone?.message && <div className="text-sm text-red-600">{err.phone.message}</div>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Роль</Label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-2xl border p-4">
                        <RadioGroupItem value="buyer" id="rb" className="h-5 w-5" />
                        <Label htmlFor="rb" className="text-lg">Покупатель</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border p-4">
                        <RadioGroupItem value="seller" id="rs" className="h-5 w-5" />
                        <Label htmlFor="rs" className="text-lg">Продавец</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {!codeSent && (
                <Button
                  type="button"
                  onClick={onSend}
                  disabled={sendCode.isPending || !!err.phone}
                  className="h-14 w-full rounded-2xl bg-emerald-600 text-lg text-white"
                >
                  Отправить код
                </Button>
              )}

              {codeSent && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base">Код из СМС</Label>
                    <Controller
                      control={control}
                      name="code"
                      render={({ field }) => (
                        <InputOTP
                          maxLength={6}
                          value={field.value || ""}
                          onChange={(v) => field.onChange(v.replace(/\D/g, "").slice(0, 6))}
                          className="justify-center"
                        >
                          <InputOTPGroup className="gap-3">
                            <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                            <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                            <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                            <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                            <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                            <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={verifyCode.isPending}
                    className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-violet-500 text-lg text-white"
                  >
                    Подтвердить и продолжить
                  </Button>
                </>
              )}
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Вы вошли как: {role === "seller" ? "Продавец" : "Покупатель"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
