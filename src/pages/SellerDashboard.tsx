import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import BubblesBackground from "@/components/BubblesBackground"
import { token } from "@/lib/api"
import { useNavigate } from "react-router-dom"

export default function SellerDashboard() {
  const nav = useNavigate()
  return (
    <div className="relative min-h-screen" style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BubblesBackground />
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-4">
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle>Seller</CardTitle>
            <CardDescription>Панель селлера</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button onClick={() => nav("/buyer")} variant="outline">Перейти к Buyer</Button>
            <Button
              onClick={() => { token.clear(); nav("/auth", { replace: true }) }}
              className="bg-emerald-600 text-white"
            >
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
