import { useMemo, useState } from "react"
import { useCatalogSearch, type Product as CatalogProduct } from "@/hooks/queries/catalog"
import { useCategories } from "@/hooks/queries/categories"
import { useCartAddItem } from "@/hooks/queries/cart"
import { useCreateOrder } from "@/hooks/queries/orders"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Sparkles, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

export default function BuyerHome() {
  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<"cashback" | "price" | "">("")

  const { data: categoriesData } = useCategories({
    only_active: true,
    include_children: false,
  })

  const searchParams = useMemo(
    () => ({
      query: query || undefined,
      filters: {
        category_id: categoryId,
        only_active: true,
      },
      sort_by:
        sortBy === "cashback"
          ? "cashback_amount"
          : sortBy === "price"
          ? "marketplace_price"
          : undefined,
      sort_order: sortBy ? ("desc" as const) : undefined,
      page: 1,
      page_size: 30,
    }),
    [query, categoryId, sortBy],
  )

  const { data, isLoading } = useCatalogSearch(searchParams)
  const products = data?.products ?? []

  const cartAdd = useCartAddItem()
  const createOrder = useCreateOrder()

  const handleAddToCart = (productId: number) => {
    cartAdd.mutate(
      { product_id: productId },
      {
        onSuccess: () => {
          toast.success("Товар добавлен в корзину")
        },
        onError: () => {
          toast.error("Не удалось добавить в корзину")
        },
      },
    )
  }

  const handleBuyNow = (productId: number) => {
    createOrder.mutate(
      { product_id: productId },
      {
        onSuccess: () => {
          toast.success("Заказ создан, следуйте инструкции по выкупу")
        },
        onError: () => {
          toast.error("Не удалось создать заказ")
        },
      },
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500">Выкуп товаров</p>
          <h1 className="text-xl font-semibold leading-tight text-slate-900">
            Найдите товар для выкупа
          </h1>
        </div>
        <div className="rounded-2xl bg-emerald-500 px-3 py-2 text-right text-xs text-white shadow-md">
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">Кэшбэк</span>
          </div>
          <p className="text-[11px] opacity-90">Выкупайте по инструкции и получайте бонус</p>
        </div>
      </header>

      <div className="mt-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или артикулу"
              className="h-8 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus-visible:ring-0"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-2xl border-emerald-200 bg-white shadow-sm"
          >
            <SlidersHorizontal className="h-5 w-5 text-emerald-500" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            label="По размеру кэшбэка"
            active={sortBy === "cashback"}
            onClick={() => setSortBy(sortBy === "cashback" ? "" : "cashback")}
          />
          <FilterChip
            label="По цене"
            active={sortBy === "price"}
            onClick={() => setSortBy(sortBy === "price" ? "" : "price")}
          />
        </div>

        {categoriesData?.categories?.length ? (
          <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
            <Badge
              onClick={() => setCategoryId(undefined)}
              className={`cursor-pointer rounded-2xl px-3 py-1 text-xs ${
                categoryId === undefined
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              Все категории
            </Badge>
            {categoriesData.categories.map((cat) => (
              <Badge
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`cursor-pointer rounded-2xl px-3 py-1 text-xs ${
                  categoryId === cat.id
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <section className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900">Товары для выкупа</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Выбирайте и добавляйте в корзину</span>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500 shadow-sm">
            Загружаем товары…
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500 shadow-sm">
            Товары не найдены. Попробуйте изменить фильтры или запрос.
          </div>
        )}

        <div className="space-y-3 pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

type FilterChipProps = {
  label: string
  active: boolean
  onClick: () => void
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-2xl border px-3 py-1 text-[11px] font-medium transition active:scale-95 ${
        active
          ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
          : "border-emerald-100 bg-white text-slate-700"
      }`}
    >
      {label}
    </button>
  )
}

type ProductCardProps = {
  product: CatalogProduct
  onAddToCart: (id: number) => void
  onBuyNow: (id: number) => void
}

function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const cashbackPercent =
    product.marketplace_price > 0
      ? Math.round((product.cashback_amount / product.marketplace_price) * 100)
      : 0

  return (
    <div className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50">
        {product.images?.[0]?.image_url ? (
          <img
            src={product.images[0].image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-emerald-500">Нет фото</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <p className="line-clamp-2 text-[13px] font-semibold text-slate-900">
              {product.name}
            </p>
            <p className="text-[11px] text-slate-500">Артикул {product.article}</p>
          </div>
          <Badge className="rounded-2xl bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {cashbackPercent}% кэшбэк
          </Badge>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] text-slate-500">Цена на маркетплейсе</p>
            <p className="text-sm font-semibold text-slate-900">
              {product.marketplace_price.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="space-y-0.5 text-right">
            <p className="text-[11px] text-slate-500">Вы получите</p>
            <p className="text-sm font-semibold text-emerald-600">
              {product.cashback_amount.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 flex-1 rounded-2xl border-emerald-200 text-xs font-medium text-emerald-700"
            onClick={() => onAddToCart(product.id)}
          >
            В корзину
          </Button>
          <Button
            type="button"
            className="h-9 flex-1 rounded-2xl bg-emerald-500 text-xs font-semibold text-white shadow-md active:scale-95"
            onClick={() => onBuyNow(product.id)}
          >
            Выкупить сейчас
          </Button>
        </div>
      </div>
    </div>
  )
}
