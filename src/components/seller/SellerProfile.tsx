export default function SellerProfile() {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-slate-900 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-xl">
            🧑‍💼
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-50">
              Ваш профиль
            </div>
            <div className="text-xs text-slate-400">
              Управляйте данными продавца и оплатой доступа
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl bg-slate-900 px-4 py-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Статус подписки</span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Активна
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Телефон</span>
          <span className="font-medium text-slate-50">+7 ••• •• ••</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Telegram</span>
          <span className="font-medium text-slate-50">@username</span>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl bg-slate-900 px-4 py-4 text-sm">
        <div className="text-sm font-semibold text-slate-100">
          Связаться с админом
        </div>
        <p className="text-xs text-slate-400">
          Если возникли вопросы по выкупам, блокировкам или отчётам, напишите
          администратору. Мы поможем и разберёмся в ситуации.
        </p>
        <button className="mt-1 w-full rounded-2xl bg-slate-800 py-3 text-xs font-semibold text-slate-50">
          Написать админу в Telegram
        </button>
      </section>
    </div>
  )
}
