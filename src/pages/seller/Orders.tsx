import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useOrdersByStatus, useCancelOrder, type OrderStatus } from "@/hooks/queries/orders"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const statuses: OrderStatus[] = ["pending","paid","on_moderation","completed","cancelled"]

export default function Orders() {
  const [tab, setTab] = useState<OrderStatus>("paid")
  const { data, isLoading, isError } = useOrdersByStatus(tab, 1, 20)
  const cancelOrder = useCancelOrder()

  const canCancel = useMemo(() => tab === "pending" || tab === "paid", [tab])

  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as OrderStatus)}>
            <TabsList className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <TabsTrigger key={s} value={s} className="capitalize">{s.replace("_"," ")}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tab}>
              {isLoading && (
                <div className="grid gap-3 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              )}
              {isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  Ошибка загрузки заказов
                </div>
              )}
              {!isLoading && data && (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.orders.map((o) => (
                    <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="shadow-md">
                        <CardContent className="flex items-start justify-between gap-3 p-4">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-500">#{o.id} • {o.status.toUpperCase()}</div>
                            <div className="font-semibold">{o.product.name}</div>
                            <div className="text-sm text-slate-600">Артикул {o.product.article} • ₽ {o.amount}</div>
                          </div>
                          {canCancel && (
                            <Button
                              variant="outline"
                              onClick={() => cancelOrder.mutate({ order_id: o.id })}
                              disabled={cancelOrder.isPending}
                              className="rounded-xl"
                            >
                              Отменить
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {data.orders.length === 0 && (
                    <div className="rounded-xl border p-4 text-sm text-slate-600">Нет заказов</div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
