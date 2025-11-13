import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export default function Agreements() {
  const [offer, setOffer] = useState(false)
  const [terms, setTerms] = useState(false)
  const nav = useNavigate()
  return (
    <Card className="mx-auto w-full max-w-xl shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Согласия</CardTitle>
        <CardDescription>Примите документы для продолжения</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <input id="offer" type="checkbox" checked={offer} onChange={(e) => setOffer(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            <Label htmlFor="offer">Договор-оферта для продавцов</Label>
          </div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            <Label htmlFor="terms">Пользовательское соглашение</Label>
          </div>
        </div>
        <Button disabled={!offer || !terms} className="h-11 w-full rounded-xl bg-emerald-600 text-white" onClick={() => nav("/seller/onboarding/payment")}>
          Продолжить
        </Button>
      </CardContent>
    </Card>
  )
}
