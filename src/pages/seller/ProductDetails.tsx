import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useProduct } from "@/hooks/queries/catalog"
import { useCreateOrder } from "@/hooks/queries/orders"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductDetails() {
  const { id } = useParams()
  const pid = Number(id)
  const { data, isLoading, isError } = useProduct(pid, Boolean(pid))
  const createOrder = useCreateOrder()

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
  if (isError || !data) return <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Не удалось загрузить карточку</div>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-violet-100" />
            <div className="grid grid-cols-4 gap-2">
              {[0,1,2,3].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-emerald-50 p-3">
                <div className="text-slate-500">Маркетплейс</div>
                <div className="font-semibold">{data.marketplace.toUpperCase()}</div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <div className="text-slate-500">Артикул</div>
                <div className="font-semibold">{data.article}</div>
              </div>
              <div className="rounded-xl bg-violet-50 p-3">
                <div className="text-slate-500">Цена</div>
                <div className="font-semibold">₽ {data.marketplace_price}</div>
              </div>
              <div className="rounded-xl bg-violet-50 p-3">
                <div className="text-slate-500">Кэшбэк</div>
                <div className="font-semibold">₽ {data.cashback_amount}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-slate-500">Остаток</div>
                <div className="font-semibold">{data.quantity}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-slate-500">Заказы</div>
                <div className="font-semibold">{data.orders_count}</div>
              </div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="mb-1 text-sm font-semibold">Короткое описание</div>
              <div className="text-sm text-slate-600">{data.short_description}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="mb-1 text-sm font-semibold">Инструкция выкупа</div>
              <div className="text-sm whitespace-pre-wrap text-slate-600">{data.purchase_instruction || "—"}</div>
            </div>
            <div className="flex gap-2">
              <Button
                className="h-11 rounded-xl bg-emerald-600 text-white"
                onClick={() => createOrder.mutate({ product_id: data.id })}
                disabled={createOrder.isPending}
              >
                Тестовый выкуп
              </Button>
              <Button variant="outline" className="h-11 rounded-xl">Поделиться</Button>
            </div>
            {createOrder.isError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                Не удалось создать заказ
              </div>
            )}
            {createOrder.isSuccess && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
                Заказ создан
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
