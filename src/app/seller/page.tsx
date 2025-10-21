"use client";
import { motion } from "framer-motion";
import { categories } from "@/app/mocks/products";

export default function SellerHome() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
      <div className="text-xl font-semibold">Добавить товар в категорию</div>
      <form className="grid gap-3 max-w-xl">
        <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Название" />
        <input className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Артикул" />
        <textarea className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Описание" />
        <div className="grid grid-cols-3 gap-2">
          <input className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Стоимость ₽" />
          <input className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Кэшбэк ₽" />
          <input className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" placeholder="Кол-во" />
        </div>
        <input type="file" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-white/10">Сохранить</button>
          <a className="px-4 py-2 rounded-xl bg-white/10" href="#" target="_blank">Оплатить в yescrow</a>
        </div>
      </form>
    </motion.div>
  );
}
