/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { purchases } from "@/app/mocks/selfbuy";
import FullscreenButton from "../../_components/FullscreenButton";

export default function BuyerProfile() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="px-5 pt-6 pb-10 space-y-6">
      <h1 className="text-2xl font-semibold">Мои покупки</h1>

      <Section title="Активные">
        {purchases.active.map(x => (
          <Card key={x.id}>Ожидает заполнения чек-листа • {x.stepsFilled}/{x.stepsTotal}</Card>
        ))}
      </Section>

      <Section title="На проверке">
        {purchases.review.map(x => <Card key={x.id}>Отправлено админу • Кэшбэк {x.sumCashback} ₽</Card>)}
      </Section>

      <Section title="Завершённые">
        {purchases.done.map(x => <Card key={x.id}>Выплачено • {x.sumCashback} ₽</Card>)}
      </Section>

      <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex items-center gap-3 shadow-sm">
        Баланс: <b className="text-emerald-700">{purchases.balance} ₽</b>
        <button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Вывести деньги</button>
      </div>

      <FullscreenButton />
    </motion.div>
  );
}

function Section({title, children}:{title:string; children:any}) {
  return (
    <div>
      <div className="mb-2 text-slate-600">{title}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}
function Card({children}:{children:any}) {
  return <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm">{children}</div>;
}
