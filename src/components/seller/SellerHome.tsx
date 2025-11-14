import { useState } from "react"
import { useCategories } from "@/hooks/queries/categories"
import AddProductModal from "@/components/seller/AddProductModal"

export default function SellerHome() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: categoriesData } = useCategories({
    only_active: true,
    include_children: true,
  })

  const categories =
    categoriesData?.categories.filter((c) => c.parent_id === null) ?? []

  const selectedCategory = categoriesData?.categories.find(
    (c) => c.id === selectedCategoryId,
  )

  const subcategories =
    categoriesData?.categories.filter(
      (c) => c.parent_id === selectedCategoryId,
    ) ?? []

  return (
    <>
      <section className="mb-4 rounded-3xl bg-linear-to-br from-sky-500 via-sky-600 to-indigo-600 px-4 pb-4 pt-5 text-white shadow-xl shadow-sky-900/40">
        <div className="text-sm font-semibold">Всего к выкупу</div>
        <div className="mt-1 text-3xl font-bold tracking-tight">12 480 ₽</div>
        <div className="mt-1 text-xs text-sky-100/90">
          За последние 30 дней по всем карточкам
        </div>

        <div className="mt-4 flex gap-2 text-xs">
          <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-100/80">
              Активные
            </div>
            <div className="text-lg font-semibold">8</div>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-100/80">
              На модерации
            </div>
            <div className="text-lg font-semibold">3</div>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-100/80">
              Завершено
            </div>
            <div className="text-lg font-semibold">21</div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-sky-700 shadow-md shadow-sky-900/30 active:scale-[0.98]"
        >
          Добавить товар
        </button>
      </section>

      <section className="mb-4">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2.5">
          <span className="text-lg leading-none text-slate-400">🔎</span>
          <input
            placeholder="Поиск по артикулу или названию"
            className="h-8 flex-1 bg-transparent text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </section>

      <section className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-100">Фильтры</div>
          <button className="text-xs text-slate-400">Сбросить</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs text-slate-100">
            По размеру кэшбэка
          </button>
          <button className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs text-slate-100">
            По цене
          </button>
          <button className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs text-slate-100">
            По категории
          </button>
        </div>
      </section>

      <section>
        <div className="mb-2 text-sm font-semibold text-slate-100">
          Категории товаров
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategoryId(
                  selectedCategoryId === cat.id ? null : cat.id,
                )
              }
              className={`min-w-[120px] rounded-2xl px-3 py-2 text-left text-xs font-medium ${
                selectedCategoryId === cat.id
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-900 text-slate-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-3 rounded-2xl bg-slate-900 px-3 py-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Подкатегории
            </div>
            {subcategories.length === 0 && (
              <div className="text-xs text-slate-500">
                Для категории «{selectedCategory.name}» подкатегорий пока нет.
              </div>
            )}
            <div className="mt-1 flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl bg-slate-800 px-3 py-1.5 text-[11px] text-slate-100"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        categoriesData={categoriesData ?? null}
        preselectedCategoryId={selectedCategoryId}
      />
    </>
  )
}
