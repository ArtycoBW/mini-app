import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useCatalogSearch } from "@/hooks/queries/catalog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Catalog() {
  const { data, isLoading } = useCatalogSearch({ page: 1, page_size: 6 })
  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Каталог</CardTitle>
          <Button asChild className="bg-emerald-600 text-white">
            <Link to="/seller/catalog-search">Расширенный поиск</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />)}
          {!isLoading && data?.products.slice(0, 6).map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden shadow-md transition hover:shadow-xl">
                <div className="h-24 w-full bg-linear-to-br from-emerald-100 to-violet-100" />
                <CardContent className="p-4">
                  <div className="line-clamp-1 text-xs text-slate-500">{p.marketplace.toUpperCase()} • {p.article}</div>
                  <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-emerald-700">₽ {p.marketplace_price}</span>
                    <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-violet-700">Кэшбэк ₽ {p.cashback_amount}</span>
                  </div>
                  <Button asChild variant="outline" className="mt-3 h-8 w-full rounded-xl">
                    <Link to={`/seller/product/${p.id}`}>Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
