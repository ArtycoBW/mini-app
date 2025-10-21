/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { purchases } from "@/app/mocks/selfbuy";

export default function BuyerProfile() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-6">
      <div className="text-xl font-semibold">Мои покупки</div>

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

      <div className="rounded-2xl border border-white/10 p-4">
        Баланс: <b>{purchases.balance} ₽</b>
        <button className="ml-3 px-3 py-2 rounded-xl bg-white/10">Вывести деньги</button>
      </div>
    </motion.div>
  );
}

function Section({title, children}:{title:string; children:any}) {
  return (
    <div>
      <div className="mb-2 opacity-70">{title}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}
function Card({children}:{children:any}) {
  return <div className="rounded-2xl border border-white/10 p-3">{children}</div>;
}
