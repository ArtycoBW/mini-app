/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister } from "@/hooks/queries/auth"
import { verifiedPhone } from "@/hooks/queries/auth"
import { format8 } from "@/lib/phone"
import BubblesBackground from "@/components/BubblesBackground"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
})

export default function BuyerRegister() {
  const nav = useNavigate()
  const registerUser = useRegister()
  const { control, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", phone: verifiedPhone.get() || "8" },
  })

  const onSubmit = async (d: z.infer<typeof schema>) => {
    await registerUser.mutateAsync({
      role: "buyer",
      phone: d.phone,
      full_name: d.full_name,
      email: d.email,
      terms_accepted: true,
    })
    nav("/buyer", { replace: true })
  }

  return (
    <div className="relative min-h-screen" style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BubblesBackground />
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-4">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Регистрация покупателя</CardTitle>
            <CardDescription>Заполните данные</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>ФИО</Label>
                <Controller control={control} name="full_name" render={({ field }) => <Input {...field} placeholder="Иванов Иван" />} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Controller control={control} name="email" render={({ field }) => <Input type="email" {...field} placeholder="you@example.com" />} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
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
              <Button className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 to-violet-500 text-white" type="submit">
                Завершить регистрацию
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
