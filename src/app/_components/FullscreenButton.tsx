"use client";
import { useTelegram } from "../_lib/useTelegram";
import { Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FullscreenButton() {
  const { expand } = useTelegram();
  return (
    <motion.button
      onClick={expand}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-5 z-50 rounded-full bg-emerald-600 text-white shadow-lg px-4 py-3 flex items-center gap-2 hover:bg-emerald-700"
      title="На весь экран"
    >
      <Maximize2 size={18} />
      <span className="hidden sm:inline">На весь экран</span>
    </motion.button>
  );
}
