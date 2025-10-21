"use client";
import { motion } from "framer-motion";
import { products, categories } from "@/app/mocks/products";
import FullscreenButton from "../_components/FullscreenButton";

export default function BuyerHome() {
  return (
    <motion.div
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.2}}
      className="w-full"
    >
      <div className="px-5 pt-6 md:pt-8">
        <h1 className="text-2xl font-semibold">Категории</h1>
        <div className="mt-3 flex gap-2 flex-wrap">
          {categories.map(c => (
            <span key={c} className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{c}</span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-6">Товары</h2>
      </div>

      <div className="px-5 pb-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay: i*0.03}}
            whileHover={{ y:-2 }}
            className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">SKU: {p.sku}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{p.category}</span>
            </div>

            <div className="mt-3 text-sm">
              <div>Цена: <b>{p.price} ₽</b></div>
              <div className="text-emerald-700">Кэшбэк: <b>{p.cashback} ₽</b></div>
              <div className="text-slate-500">Остаток: {p.qty}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Выкупить</button>
              <button className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">В корзину</button>
            </div>
          </motion.div>
        ))}
      </div>

      <FullscreenButton />
    </motion.div>
  );
}
