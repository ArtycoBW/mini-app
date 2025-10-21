"use client";
import { motion } from "framer-motion";

const queue = [
  { id:"q1", user:"@buyer1", product:"Наушники Z1", files:2, text:"Все шаги выполнены" },
];

export default function Moderation() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
      <div className="text-xl font-semibold">Модерация</div>
      {queue.map(q => (
        <div key={q.id} className="rounded-2xl border border-white/10 p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{q.product}</div>
            <div className="text-sm opacity-70">{q.user} • Файлов: {q.files} • {q.text}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl bg-white/10">Одобрить</button>
            <button className="px-3 py-2 rounded-xl bg-white/5">Не одобрить</button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
