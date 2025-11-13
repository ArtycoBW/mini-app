/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCatalogSearch } from "@/hooks/queries/catalog"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

const marketplaces = ["ozon","wb","ym"]

export default function CatalogSearch() {
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const [query, setQuery] = useState(sp.get("q") || "")
  const [marketplace, setMarketplace] = useState(sp.get("marketplace") || "")
  const [minPrice, setMinPrice] = useState(sp.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(sp.get("max_price") || "")
  const [page, setPage] = useState(Number(sp.get("page") || 1))
  const params = useMemo(() => {
    const p: any = { page, page_size: 12 }
    if (query) p.query = query
    if (marketplace) p.marketplace = marketplace
    if (minPrice) p.min_price = Number(minPrice)
    if (maxPrice) p.max_price = Number(maxPrice)
    return p
  }, [query, marketplace, minPrice, maxPrice, page])
  const { data, isLoading, isError, error } = useCatalogSearch(params)

  useEffect(() => {
    const next = new URLSearchParams()
    if (query) next.set("q", query)
    if (marketplace) next.set("marketplace", marketplace)
    if (minPrice) next.set("min_price", minPrice)
    if (maxPrice) next.set("max_price", maxPrice)
    next.set("page", String(page))
    setSp(next, { replace: true })
  }, [query, marketplace, minPrice, maxPrice, page, setSp])

  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Каталог товаров</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <Label>Поиск</Label>
            <Input placeholder="Название, артикул" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Маркетплейс</Label>
            <select
              className="w-full rounded-xl border bg-white p-2 text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value)}
            >
              <option value="">Все</option>
              {marketplaces.map((m) => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Цена от</Label>
              <Input inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Цена до</Label>
              <Input inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {(error as any)?.detail?.map?.((d: any, i: number) => <div key={i}>{d.msg}</div>) || "Ошибка загрузки"}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        {!isLoading && data?.products.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="group"
          >
            <Card className="h-full overflow-hidden shadow-md transition hover:shadow-xl">
              <div className="h-36 w-full bg-linear-to-br from-emerald-100 to-violet-100" />
              <CardContent className="space-y-2 p-4">
                <div className="line-clamp-1 text-sm text-slate-500">{p.marketplace.toUpperCase()} • {p.article}</div>
                <div className="line-clamp-2 font-semibold">{p.name}</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-emerald-700">₽ {p.marketplace_price}</span>
                  <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-violet-700">Кэшбэк ₽ {p.cashback_amount}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button asChild className="h-9 rounded-xl bg-emerald-600 text-white">
                    <Link to={`/seller/product/${p.id}`}>Подробнее</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl"
                    onClick={() => nav(`/seller/product/${p.id}`)}
                  >
                    Открыть
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Назад</Button>
        <div className="text-sm text-slate-500">
          Стр. {data?.page || page} из {data?.total_pages || "—"} • всего {data?.total || 0}
        </div>
        <Button variant="outline" onClick={() => setPage((p) => (data?.total_pages && p >= data.total_pages ? p : p + 1))} disabled={Boolean(data && page >= data.total_pages)}>Вперёд</Button>
      </div>
    </div>
  )
}
