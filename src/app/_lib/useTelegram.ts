/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo } from "react";

export function useTelegram() {
  const tg = useMemo(() => (typeof window !== "undefined"
    ? (window as any).Telegram?.WebApp
    : undefined),
  []);

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand(); // разворачиваем на всю высоту webview
    tg.disableVerticalSwipe?.(); // меньше «отскоков» при скролле
    // цвета под тему Telegram
    const tp = tg.themeParams || {};
    tg.setHeaderColor?.(tp.bg_color ? "secondary_bg_color" : "#0f172a");
    tg.setBackgroundColor?.(tp.bg_color || "#0b1220");
  }, [tg]);

  return tg;
}
