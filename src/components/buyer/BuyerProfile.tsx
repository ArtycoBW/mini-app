/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type JSX } from "react"
import { useMyOrders, useSubmitOrderReport, type Order } from "@/hooks/queries/orders"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CheckCircle2, Clock, FileText, Loader2, MessageCircle, ShoppingBag } from "lucide-react"

type ReportFormState = {
  order: Order | null
  text: string
  screenshots: string
}

export default function BuyerProfile() {
  const { data, isLoading } = useMyOrders({ page: 1, page_size: 100 })
  const orders = data?.orders ?? []

  const [reportForm, setReportForm] = useState<ReportFormState>({
    order: null,
    text: "",
    screenshots: "",
  })

  const submitReport = useSubmitOrderReport()

  const { activeOrders, moderationOrders, completedOrders, cancelledOrders, totalEarned } =
    useMemo(() => {
      const active = orders.filter(
        (o) => o.status === "pending" || o.status === "paid",
      )
      const moderation = orders.filter((o) => o.status === "on_moderation")
      const completed = orders.filter((o) => o.status === "completed")
      const cancelled = orders.filter((o) => o.status === "cancelled")
      const earned = completed.reduce((sum, o) => sum + (o.cashback_amount || 0), 0)
      return {
        activeOrders: active,
        moderationOrders: moderation,
        completedOrders: completed,
        cancelledOrders: cancelled,
        totalEarned: earned,
      }
    }, [orders])

  const openReportForm = (order: Order) => {
    setReportForm({
      order,
      text: order.report_article ?? "",
      screenshots: "",
    })
  }

  const closeReportForm = () => {
    setReportForm({
      order: null,
      text: "",
      screenshots: "",
    })
  }

  const handleSubmitReport = () => {
    if (!reportForm.order) return
    const screenshots = reportForm.screenshots
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    submitReport.mutate(
      {
        order_id: reportForm.order.id,
        data: {
          report_article: reportForm.text,
          screenshot_urls: screenshots,
        },
      },
      {
        onSuccess: () => {
          toast.success("Отчёт отправлен на проверку")
          closeReportForm()
        },
        onError: () => {
          toast.error("Не удалось отправить отчёт")
        },
      },
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 pb-6">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500">Профиль</p>
          <h1 className="text-xl font-semibold leading-tight text-slate-900">
            Мои выкупы и кэшбэк
          </h1>
        </div>
        <div className="rounded-2xl bg-emerald-500 px-3 py-2 text-right text-xs text-white shadow-md">
          <p className="text-[11px] opacity-80">Заработано кэшбэка</p>
          <p className="text-lg font-semibold">
            {totalEarned.toLocaleString("ru-RU")} ₽
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
          <span>Загружаем ваши выкупы…</span>
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="mt-2 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          Пока нет выкупов. Выберите товар на главной и создайте первый заказ.
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-3">
          <Section
            title="Активные выкупы"
            description="Товары, которые вы уже выкупаете"
            icon={<ShoppingBag className="h-4 w-4 text-emerald-500" />}
            badge={activeOrders.length}
          >
            {activeOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onAddReport={() => openReportForm(order)}
              />
            ))}
          </Section>

          <Section
            title="На модерации"
            description="Отчёты, которые сейчас проверяются"
            icon={<Clock className="h-4 w-4 text-amber-500" />}
            badge={moderationOrders.length}
          >
            {moderationOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </Section>

          <Section
            title="Завершённые"
            description="Выкупы, по которым кэшбэк уже начислен"
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            badge={completedOrders.length}
          >
            {completedOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </Section>

          {cancelledOrders.length > 0 && (
            <Section
              title="Отменённые"
              description="Заказы, которые не были завершены"
              icon={<FileText className="h-4 w-4 text-slate-400" />}
              badge={cancelledOrders.length}
            >
              {cancelledOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </Section>
          )}

          <Section
            title="Связаться с админом"
            description="Если что-то пошло не так, напишите нам"
            icon={<MessageCircle className="h-4 w-4 text-emerald-500" />}
          >
            <Button className="h-10 w-full rounded-2xl bg-emerald-500 text-sm font-semibold text-white shadow-md active:scale-95">
              Написать админу в Telegram
            </Button>
          </Section>
        </div>
      )}

      {reportForm.order && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40">
          <div className="max-h-[80vh] w-full max-w-md rounded-t-3xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-xl">
            <div className="mb-2 h-1 w-12 rounded-full bg-slate-200 mx-auto" />
            <h2 className="text-base font-semibold text-slate-900">
              Отчёт по выкупу
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {reportForm.order.product.name}
            </p>

            <div className="mt-3 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-700">
                  Текст отчёта
                </p>
                <Textarea
                  value={reportForm.text}
                  onChange={(e: any) =>
                    setReportForm((s) => ({ ...s, text: e.target.value }))
                  }
                  placeholder="Опишите, как вы выполнили выкуп и оставили отзыв"
                  className="min-h-20 resize-none rounded-2xl bg-slate-50 text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-700">
                  Ссылки на скриншоты
                </p>
                <Textarea
                  value={reportForm.screenshots}
                  onChange={(e: any) =>
                    setReportForm((s) => ({ ...s, screenshots: e.target.value }))
                  }
                  placeholder="Вставьте по одной ссылке на строку"
                  className="min-h-[70px] resize-none rounded-2xl bg-slate-50 text-sm"
                />
                <p className="text-[10px] text-slate-400">
                  Скрин поиска товара, заказа, доставки и отзыва.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1 rounded-2xl border-slate-200 text-xs"
                onClick={closeReportForm}
                disabled={submitReport.isPending}
              >
                Отмена
              </Button>
              <Button
                type="button"
                className="h-9 flex-1 rounded-2xl bg-emerald-500 text-xs font-semibold text-white shadow-md active:scale-95 disabled:opacity-60"
                onClick={handleSubmitReport}
                disabled={submitReport.isPending}
              >
                {submitReport.isPending ? "Отправляем…" : "Отправить отчёт"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type SectionProps = {
  title: string
  description: string
  icon: JSX.Element
  badge?: number
  children: React.ReactNode
}

function Section({ title, description, icon, badge, children }: SectionProps) {
  const hasItems =
    Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <section className="rounded-3xl bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-50">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-[11px] text-slate-500">{description}</p>
          </div>
        </div>
        {typeof badge === "number" && (
          <Badge className="rounded-2xl bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {badge}
          </Badge>
        )}
      </div>
      {hasItems ? (
        <div className="mt-3 space-y-2">{children}</div>
      ) : (
        <p className="mt-3 text-[11px] text-slate-500">Пока пусто.</p>
      )}
    </section>
  )
}

type OrderRowProps = {
  order: Order
  onAddReport?: () => void
}

function OrderRow({ order, onAddReport }: OrderRowProps) {
  const canAddReport =
    (order.status === "paid" || order.status === "pending") &&
    !order.report_submitted_at

  return (
    <div className="flex items-start justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
      <div className="space-y-0.5">
        <p className="line-clamp-2 text-[13px] font-semibold text-slate-900">
          {order.product.name}
        </p>
        <p className="text-[11px] text-slate-500">
          Артикул {order.product.article} · Кэшбэк{" "}
          <span className="font-semibold text-emerald-600">
            {order.cashback_amount.toLocaleString("ru-RU")} ₽
          </span>
        </p>
        <p className="text-[10px] text-slate-400">
          Статус: {order.status}
        </p>
      </div>
      {canAddReport && onAddReport && (
        <Button
          type="button"
          size="sm"
          className="h-8 rounded-2xl bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm active:scale-95"
          onClick={onAddReport}
        >
          Добавить отчёт
        </Button>
      )}
    </div>
  )
}
