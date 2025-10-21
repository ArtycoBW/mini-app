"use client";
import { useRole } from "../_lib/role";
import { motion } from "framer-motion";

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const btn = "px-3 py-1 rounded-xl text-sm bg-white/10 hover:bg-white/20";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 backdrop-blur bg-white/5 border border-white/10 p-2 rounded-2xl flex gap-2"
    >
      {(["buyer","seller","admin"] as const).map(r => (
        <button key={r} className={`${btn} ${role===r ? "bg-white/20" : ""}`} onClick={()=>setRole(r)}>
          {r}
        </button>
      ))}
    </motion.div>
  );
}
