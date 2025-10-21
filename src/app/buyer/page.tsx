"use client";
import { motion } from "framer-motion";
import { products, categories } from "@/app/mocks/products";

export default function BuyerHome() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.2}} className="space-y-4">
      <div className="text-xl font-semibold">Категории</div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => <span key={c} className="px-3 py-1 rounded-full bg-white/10">{c}</span>)}
      </div>

      <div className="text-xl font-semibold mt-4">Товары</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(p => (
          <motion.div key={p.id} whileHover={{scale:1.01}} className="rounded-2xl border border-white/10 p-3">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs opacity-60">SKU: {p.sku}</div>
            <div className="mt-2 text-sm">Цена: {p.price} ₽ • Кэшбэк: {p.cashback} ₽ • Остаток: {p.qty}</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 rounded-xl bg-white/10">Выкупить</button>
              <button className="px-3 py-2 rounded-xl bg-white/5">В корзину</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
