import type { JSX } from "react"
import { Home, User } from "lucide-react"

type BuyerTab = "main" | "profile"

type Props = {
  tab: BuyerTab
  onChange: (tab: BuyerTab) => void
}

export default function BuyerBottomNav({ tab, onChange }: Props): JSX.Element {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-emerald-100 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2 shadow-[0_-6px_20px_rgba(15,118,110,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-md gap-3">
        <button
          type="button"
          onClick={() => onChange("main")}
          className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium transition active:scale-95 ${
            tab === "main"
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-transparent text-slate-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Главная</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("profile")}
          className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium transition active:scale-95 ${
            tab === "profile"
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-transparent text-slate-500"
          }`}
        >
          <User className="h-5 w-5" />
          <span>Профиль</span>
        </button>
      </div>
    </nav>
  )
}
