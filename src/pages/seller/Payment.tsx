import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Payment() {
  const nav = useNavigate()
  return (
    <Card className="mx-auto w-full max-w-xl shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Активация доступа</CardTitle>
        <CardDescription>Перейдите к каталогу после активации</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border p-4 text-sm text-slate-600">
          Доступ активирован. Нажмите, чтобы продолжить.
        </div>
        <Button className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 to-violet-500 text-white" onClick={() => nav("/seller/catalog-search")}>
          Перейти к каталогу
        </Button>
      </CardContent>
    </Card>
  )
}
