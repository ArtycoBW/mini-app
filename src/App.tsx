import { useEffect, type JSX } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { token } from "@/lib/api"
import AuthPhone from "@/pages/AuthPhone"
import BuyerRegister from "@/pages/register/BuyerRegister"
import SellerRegister from "@/pages/register/SellerRegister"
import BuyerDashboard from "@/pages/BuyerDashboard"
import SellerLayout from "@/pages/seller/SellerLayout"
import SellerHome from "@/pages/seller/Home"
import SellerProfile from "@/pages/seller/Profile"
import OnboardingStart from "@/pages/seller/OnboardingStart"
import Agreements from "@/pages/seller/Agreements"
import Payment from "@/pages/seller/Payment"
import Catalog from "@/pages/seller/Catalog"
import AddProduct from "@/pages/seller/AddProduct"
import CatalogSearch from "@/pages/seller/CatalogSearch"
import ProductDetails from "@/pages/seller/ProductDetails"
import Orders from "@/pages/seller/Orders"

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
          <Route path="/" element={<Navigate to={token.get() ? "/buyer" : "/auth"} replace />} />
          <Route path="/auth" element={<AuthPhone />} />
          <Route path="/register/buyer" element={<Protected><BuyerRegister /></Protected>} />
          <Route path="/register/seller" element={<Protected><SellerRegister /></Protected>} />
          <Route path="/buyer" element={<Protected><BuyerDashboard /></Protected>} />

          <Route path="/seller/onboarding" element={<Protected><OnboardingStart /></Protected>} />
          <Route path="/seller/onboarding/agreements" element={<Protected><Agreements /></Protected>} />
          <Route path="/seller/onboarding/payment" element={<Protected><Payment /></Protected>} />
          <Route path="/seller/catalog" element={<Protected><Catalog /></Protected>} />
          <Route path="/seller/catalog-search" element={<Protected><CatalogSearch /></Protected>} />
          <Route path="/seller/product/:id" element={<Protected><ProductDetails /></Protected>} />
          <Route path="/seller/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/seller/add-product" element={<Protected><AddProduct /></Protected>} />

          <Route path="/seller" element={<Protected><SellerLayout /></Protected>}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<SellerHome />} />
            <Route path="profile" element={<SellerProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
