/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSendCode, useVerifyCode } from "@/hooks/queries/auth"
import { format8 } from "@/lib/phone"
import BubblesBackground from "@/components/BubblesBackground"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useNavigate } from "react-router-dom"

const phoneSchema = z.string().min(1).transform((v) => format8(v).digits).refine((v) => /^8\d{10}$/.test(v), "Номер должен начинаться с 8 и содержать 11 цифр")

const schema = z.object({
  phone: phoneSchema,
  role: z.enum(["buyer", "seller"]),
  code: z.string().min(4),
})

export default function AuthPhone() {
  const [codeSent, setCodeSent] = useState(false)
  const sendCode = useSendCode()
  const verifyCode = useVerifyCode()
  const nav = useNavigate()

  const { control, handleSubmit, setValue, getValues } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: "buyer", phone: "8", code: "" },
    mode: "onChange",
  })

  const onSendCode = async () => {
    const digits = format8(getValues("phone")).digits
    await sendCode.mutateAsync({ phone_number: digits })
    setValue("phone", digits)
    setCodeSent(true)
  }

  const onVerify = async (d: z.infer<typeof schema>) => {
    const res = await verifyCode.mutateAsync({ phone_number: d.phone, code: d.code, role: d.role })
    if (res.is_new_user) nav(d.role === "seller" ? "/register/seller" : "/register/buyer", { replace: true })
    else nav(d.role === "seller" ? "/seller" : "/buyer", { replace: true })
  }

  return (
    <div className="relative min-h-screen" style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BubblesBackground />
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-4">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-2xl font-extrabold text-transparent">
              АтмоСфера
            </CardTitle>
            <CardDescription>Вход по номеру телефона</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onVerify)}>
              <div className="space-y-2">
                <Label>Номер телефона</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={useMemo(() => format8(field.value).formatted, [field.value])}
                      onChange={(e) => setValue("phone", format8(e.target.value).digits)}
                      placeholder="8-900-123-45-67"
                      inputMode="tel"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Роль</Label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 rounded-xl border p-3">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">Покупатель</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border p-3">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller">Продавец</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
              {!codeSent && (
                <Button type="button" onClick={onSendCode} disabled={sendCode.isPending} className="h-11 w-full rounded-xl bg-emerald-600 text-white">
                  Отправить код
                </Button>
              )}
              {codeSent && (
                <div className="space-y-3">
                  <Label>Код из SMS</Label>
                  <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                  <Button disabled={verifyCode.isPending} className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-violet-500 text-white" type="submit">
                    Подтвердить
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
