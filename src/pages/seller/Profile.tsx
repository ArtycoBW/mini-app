
import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSellerMe } from "@/hooks/queries/auth"

export default function SellerProfile() {
  const q = useSellerMe()
  useEffect(() => {
    q.refetch()
  }, [])
  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Профиль продавца</CardTitle>
          <CardDescription>Ваши реквизиты и состояние аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">Организация</div>
            <div className="mt-1 font-semibold">{q.data?.organization_name || "—"}</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">ИНН</div>
            <div className="mt-1 font-semibold">{q.data?.inn || "—"}</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">БИК</div>
            <div className="mt-1 font-semibold">{q.data?.bik || "—"}</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">Банк</div>
            <div className="mt-1 font-semibold">{q.data?.bank_name || "—"}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Поддержка</CardTitle>
          <CardDescription>Связь с администратором</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-emerald-600 text-white">
            <a href="https://t.me/your_admin_link" target="_blank">Написать в Telegram</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
