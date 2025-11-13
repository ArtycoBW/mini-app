import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function OnboardingStart() {
  const nav = useNavigate()
  return (
    <Card className="mx-auto w-full max-w-xl shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Регистрация завершена</CardTitle>
        <CardDescription>Продолжите, чтобы активировать доступ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 to-violet-500 text-white" onClick={() => nav("/seller/onboarding/agreements")}>
          Далее
        </Button>
      </CardContent>
    </Card>
  )
}
