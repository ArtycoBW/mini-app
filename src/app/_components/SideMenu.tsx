"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const items = menuByRole[role] ?? [];

  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 shrink-0 border-r border-emerald-100/80 bg-white/70 backdrop-blur sticky top-0 h-[100dvh] hidden md:block"
    >
      <div className="px-4 py-3 text-xs tracking-wide text-emerald-700/80 font-semibold">МЕНЮ</div>
      <nav className="grid">
        {items.map(i => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={[
                "px-4 py-2.5",
                "hover:bg-emerald-50",
                active ? "bg-emerald-100/70 text-emerald-800 font-medium border-l-4 border-emerald-500" : "text-slate-700"
              ].join(" ")}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
