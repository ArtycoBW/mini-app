"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRole } from "../_lib/role";

const menuByRole = {
  seller: [
    { href: "/seller", label: "Главная" },
    { href: "/seller/profile", label: "Профиль" },
  ],
  buyer: [
    { href: "/buyer", label: "Главная" },
    { href: "/buyer/profile", label: "Профиль" },
  ],
  admin: [
    { href: "/admin/buyer", label: "Главная как у покупателя" },
    { href: "/admin/seller", label: "Селлер" },
    { href: "/admin/moderation", label: "Модерация" },
    { href: "/admin/stats", label: "Статистика по товарам" },
  ],
} as const;

export default function SideMenu() {
  const { role } = useRole();
  const items = menuByRole[role] ?? [];
  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 shrink-0 border-r border-white/10 p-3 hidden md:block"
    >
      <div className="text-sm uppercase opacity-60 mb-2">Меню</div>
      <nav className="grid gap-2">
        {items.map(i => (
          <Link key={i.href} className="rounded-xl px-3 py-2 hover:bg-white/5" href={i.href}>{i.label}</Link>
        ))}
      </nav>
    </motion.aside>
  );
}
