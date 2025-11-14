import { useEffect, useMemo, useState } from "react"
import type { CategoryListResponse } from "@/hooks/queries/categories"
import { useCreateAdminProduct, type AdminProductPayload } from "@/hooks/queries/adminProducts"


type Props = {
  open: boolean
  onClose: () => void
  categoriesData: CategoryListResponse | null
  preselectedCategoryId: number | null
}

const marketplaces = [
  { id: "ozon", label: "Ozon" },
  { id: "yandex", label: "Яндекс Маркет" },
  { id: "wb", label: "WB" },
] as const

type MarketplaceId = (typeof marketplaces)[number]["id"]

export default function AddProductModal({
  open,
  onClose,
  categoriesData,
  preselectedCategoryId,
}: Props) {
  const [marketplace, setMarketplace] = useState<MarketplaceId>("ozon")
  const [categoryId, setCategoryId] = useState<number | null>(
    preselectedCategoryId,
  )
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null)

  const [article, setArticle] = useState("")
  const [name, setName] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [marketplacePrice, setMarketplacePrice] = useState("")
  const [cashbackAmount, setCashbackAmount] = useState("")
  const [buyerPrice, setBuyerPrice] = useState("")
  const [instruction, setInstruction] = useState("")
  const [returnType, setReturnType] = useState<"returnable" | "non_returnable">(
    "returnable",
  )
  const [returnDays, setReturnDays] = useState("30")
  const [imageUrls, setImageUrls] = useState("")

  const createProduct = useCreateAdminProduct()

  useEffect(() => {
    if (open) {
      setCategoryId(preselectedCategoryId)
    }
  }, [open, preselectedCategoryId])

  const categories =
    categoriesData?.categories.filter((c) => c.parent_id === null) ?? []

  const subcategories = useMemo(
    () =>
      categoriesData?.categories.filter(
        (c) => c.parent_id === categoryId,
      ) ?? [],
    [categoriesData, categoryId],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) return
    const payload: AdminProductPayload = {
      category_id: categoryId,
      subcategory_id: subcategoryId ?? null,
      marketplace,
      article: article.trim(),
      name: name.trim(),
      short_description: shortDescription.trim(),
      quantity: Number(quantity) || 0,
      marketplace_price: Number(marketplacePrice) || 0,
      cashback_amount: Number(cashbackAmount) || 0,
      buyer_price: Number(buyerPrice) || 0,
      purchase_instruction: instruction.trim(),
      return_type: returnType,
      return_days: Number(returnDays) || 0,
      is_active: true,
      images: imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean)
        .map((u) => ({ image_url: u })),
    }
    createProduct.mutate(payload)
  }

  const resetAndClose = () => {
    if (createProduct.isPending) return
    setArticle("")
    setName("")
    setShortDescription("")
    setQuantity("")
    setMarketplacePrice("")
    setCashbackAmount("")
    setBuyerPrice("")
    setInstruction("")
    setReturnType("returnable")
    setReturnDays("30")
    setImageUrls("")
    setSubcategoryId(null)
    createProduct.reset()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60">
      <div className="max-h-[92vh] w-full rounded-t-3xl bg-slate-950 px-4 pb-5 pt-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700" />
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-semibold text-slate-50">
            Добавить товар
          </div>
          <button
            onClick={resetAndClose}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
          >
            Закрыть
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[74vh] flex-col gap-4 overflow-y-auto pb-2"
        >
          <div>
            <div className="mb-1 text-xs font-semibold text-slate-300">
              Маркетплейс
            </div>
            <div className="flex gap-2">
              {marketplaces.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMarketplace(m.id)}
                  className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold ${
                    marketplace === m.id
                      ? "bg-sky-500 text-white"
                      : "bg-slate-900 text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-slate-300">
              Категория
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategoryId(cat.id)
                    setSubcategoryId(null)
                  }}
                  className={`min-w-[110px] rounded-2xl px-3 py-2 text-left text-xs font-medium ${
                    categoryId === cat.id
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-900 text-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {categoryId && subcategories.length > 0 && (
              <div className="mt-2">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Подкатегория
                </div>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((sub) => (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() =>
                        setSubcategoryId(
                          subcategoryId === sub.id ? null : sub.id,
                        )
                      }
                      className={`rounded-2xl px-3 py-1.5 text-[11px] ${
                        subcategoryId === sub.id
                          ? "bg-sky-500 text-white"
                          : "bg-slate-900 text-slate-100"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Артикул товара
              </label>
              <input
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                placeholder="Например, 123456"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Кол-во
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                inputMode="numeric"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Название товара
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
              placeholder="Блузка, рубашка, джемпер…"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Короткое описание
            </label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="min-h-[70px] w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
              placeholder="Нижнее белье, домашняя одежда и т.д."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Фото товара (по одному URL в строке)
            </label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="min-h-[70px] w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
              placeholder="https://...jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Цена на маркетплейсе
              </label>
              <input
                value={marketplacePrice}
                onChange={(e) => setMarketplacePrice(e.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                placeholder="1999"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                За отзыв вы заплатите
              </label>
              <input
                value={cashbackAmount}
                onChange={(e) => setCashbackAmount(e.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                placeholder="400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Стоимость для вас
              </label>
              <input
                value={buyerPrice}
                onChange={(e) => setBuyerPrice(e.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                placeholder="1599"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-slate-300">
              Инструкция по выкупу
            </div>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl bg-slate-900 px-3 py-2 text-xs text-slate-100"
                onClick={() =>
                  setInstruction(
                    "Скопируйте артикул, найдите товар на маркетплейсе, добавьте в корзину и оформите заказ. После получения оставьте отзыв и загрузите скриншоты в бота.",
                  )
                }
              >
                Использовать нашу инструкцию
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-slate-900 px-3 py-2 text-xs text-slate-100"
              >
                Свой текст
              </button>
            </div>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="min-h-[80px] w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
              placeholder="Опишите шаги для покупателя"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-300">
                Возврат товара
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReturnType("non_returnable")}
                  className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold ${
                    returnType === "non_returnable"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-900 text-slate-100"
                  }`}
                >
                  Не возвратный
                </button>
                <button
                  type="button"
                  onClick={() => setReturnType("returnable")}
                  className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold ${
                    returnType === "returnable"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-900 text-slate-100"
                  }`}
                >
                  Возвратный
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Кол-во дней на возврат
              </label>
              <input
                value={returnDays}
                onChange={(e) => setReturnDays(e.target.value)}
                inputMode="numeric"
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
                placeholder="30"
              />
            </div>
          </div>

          {createProduct.isSuccess && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-xs text-emerald-100">
              <div className="mb-1 font-semibold">
                Карточка создана. Осталось оплатить размещение.
              </div>
              <div className="mb-2 text-[11px] text-emerald-100/80">
                После оплаты товар станет доступен покупателям в каталоге.
              </div>
              <a
                href={createProduct.data.payment_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950"
              >
                Перейти к оплате
              </a>
            </div>
          )}

          {createProduct.isError && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              Что-то пошло не так. Попробуйте ещё раз.
            </div>
          )}

          <button
            type="submit"
            disabled={createProduct.isPending || !categoryId || !name || !article}
            className="mt-1 w-full rounded-2xl bg-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 disabled:opacity-60"
          >
            {createProduct.isPending ? "Создаём..." : "Опубликовать"}
          </button>
        </form>
      </div>
    </div>
  )
}
