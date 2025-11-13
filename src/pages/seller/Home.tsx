
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useOrdersByStatus } from "@/hooks/queries/orders"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SellerHome() {
  const paid = useOrdersByStatus("paid", 1, 1)
  const onMod = useOrdersByStatus("on_moderation", 1, 1)
  const completed = useOrdersByStatus("completed", 1, 1)
  const totalPaid = useMemo(() => paid.data?.total ?? 0, [paid.data])
  const totalOnMod = useMemo(() => onMod.data?.total ?? 0, [onMod.data])
  const totalCompleted = useMemo(() => completed.data?.total ?? 0, [completed.data])

  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Быстрый поиск</CardTitle>
          <CardDescription>Каталог карточек для выкупов</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Артикул" />
          <Input placeholder="Название" />
          <div className="flex gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/seller/catalog-search">Открыть каталог</Link>
            </Button>
            <Button asChild className="w-full bg-emerald-600 text-white">
              <Link to="/seller/add-product">Добавить карточку</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Активные выкупы</div>
              <div className="mt-1 text-3xl font-extrabold text-emerald-700">{totalPaid}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">На модерации</div>
              <div className="mt-1 text-3xl font-extrabold text-violet-700">{totalOnMod}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Завершённые</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-800">{totalCompleted}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to="/seller/catalog-search">Каталог</Link></Button>
          <Button asChild variant="outline"><Link to="/seller/orders">Мои заказы</Link></Button>
          <Button asChild variant="outline"><Link to="/seller/add-product">Создать карточку</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}
