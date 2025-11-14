import { useEffect, type JSX } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import { token } from "@/lib/api"
import AuthPhone from "@/pages/AuthPhone"
import BuyerRegister from "@/pages/register/BuyerRegister"
import SellerRegister from "@/pages/register/SellerRegister"
import BuyerDashboard from "@/pages/BuyerDashboard"
import SellerDashboard from "@/pages/SellerDashboard"

function Protected({ children }: { children: JSX.Element }) {
  return token.get() ? children : <Navigate to="/auth" replace />
}

function TelegramBoot() {
  const loc = useLocation()
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setBackgroundColor("#f4f4f5")
    }
  }, [loc.pathname])
  return null
}

export default function App() {
  return (
    <div style={{ minHeight: "var(--tg-viewport-stable-height, 100vh)" }}>
      <BrowserRouter>
        <TelegramBoot />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={token.get() ? "/seller" : "/auth"} replace />
            }
          />
          <Route path="/auth" element={<AuthPhone />} />
          <Route
            path="/register/buyer"
            element={
              <Protected>
                <BuyerRegister />
              </Protected>
            }
          />
          <Route
            path="/register/seller"
            element={
              <Protected>
                <SellerRegister />
              </Protected>
            }
          />
          <Route
            path="/buyer"
            element={
              <Protected>
                <BuyerDashboard />
              </Protected>
            }
          />
          <Route
            path="/seller"
            element={
              <Protected>
                <SellerDashboard />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
