import { useState } from "react"
import SellerHome from "@/components/seller/SellerHome"
import SellerProfile from "@/components/seller/SellerProfile"

type Tab = "home" | "profile"

export default function SellerDashboard() {
  const [tab, setTab] = useState<Tab>("home")

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <header className="px-4 pt-4 pb-3">
        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
          Панель продавца
        </div>
        <div className="mt-1 text-[22px] font-semibold leading-tight">
          {tab === "home" ? "Главная" : "Профиль"}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {tab === "home" ? <SellerHome /> : <SellerProfile />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-900/95 px-4 pb-4 pt-3 backdrop-blur">
        <div className="flex gap-3">
          <button
            onClick={() => setTab("home")}
            className={`flex-1 rounded-2xl py-3 text-sm font-medium transition ${
              tab === "home"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`flex-1 rounded-2xl py-3 text-sm font-medium transition ${
              tab === "profile"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Профиль
          </button>
        </div>
      </nav>
    </div>
  )
}
