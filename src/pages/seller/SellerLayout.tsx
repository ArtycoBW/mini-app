// src/pages/seller/SellerLayout.tsx
import { NavLink, Outlet } from "react-router-dom"
import BubblesBackground from "@/components/BubblesBackground"
import { Home, ShoppingBasket, ListChecks, User2 } from "lucide-react"

export default function SellerLayout() {
  return (
    <div className="relative min-h-screen pb-16" style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BubblesBackground />
      <div className="mx-auto max-w-3xl p-4">
        <Outlet />
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-2">
          <NavLink
            to="/seller/home"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600"}`
            }
          >
            <Home className="h-4 w-4" />
            Главная
          </NavLink>
          <NavLink
            to="/seller/catalog-search"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600"}`
            }
          >
            <ShoppingBasket className="h-4 w-4" />
            Каталог
          </NavLink>
          <NavLink
            to="/seller/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600"}`
            }
          >
            <ListChecks className="h-4 w-4" />
            Заказы
          </NavLink>
          <NavLink
            to="/seller/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600"}`
            }
          >
            <User2 className="h-4 w-4" />
            Профиль
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
