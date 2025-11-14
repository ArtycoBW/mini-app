import { useState, type JSX } from "react"
import BuyerHome from "@/components/buyer/BuyerHome"
import BuyerProfile from "@/components/buyer/BuyerProfile"
import BuyerBottomNav from "@/components/buyer/BuyerBottomNav"

type BuyerTab = "main" | "profile"

export default function BuyerDashboard(): JSX.Element {
  const [tab, setTab] = useState<BuyerTab>("main")

  return (
    <div className="flex min-h-(--tg-viewport-stable-height,100vh) flex-col bg-linear-to-b from-emerald-50 via-white to-emerald-50 text-slate-900">
      <div className="flex-1 overflow-y-auto px-3 pb-24 pt-3">
        {tab === "main" ? <BuyerHome /> : <BuyerProfile />}
      </div>
      <BuyerBottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
