import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BubblesBackground from "@/components/BubblesBackground"
import { useNavigate } from "react-router-dom"

export default function ChooseRole() {
  const nav = useNavigate()
  return (
    <div className="relative min-h-screen" style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BubblesBackground />
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-4">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Выберите роль</CardTitle>
            <CardDescription>Продолжите регистрацию</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Button onClick={() => nav("/register/buyer")} className="h-12 rounded-xl bg-emerald-600 text-white">Я покупатель</Button>
            <Button onClick={() => nav("/register/seller")} variant="outline" className="h-12 rounded-xl">Я продавец</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
