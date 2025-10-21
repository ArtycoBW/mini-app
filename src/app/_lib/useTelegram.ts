/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useCallback } from "react";

export function useTelegram() {
  const tg = useMemo(() => (typeof window !== "undefined"
    ? (window as any).Telegram?.WebApp
    : undefined), []);

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();                          // максимум высоты в webview
    tg.disableVerticalSwipe?.();
    tg.setHeaderColor?.("secondary_bg_color");
    tg.setBackgroundColor?.("#ffffff");
  }, [tg]);

  const expand = useCallback(() => {
    tg?.expand(); // официально это и есть «full screen» для WebApp
    // Дополнительно растягиваем наш контейнер:
    document.documentElement.style.setProperty("--vh", window.innerHeight + "px");
  }, [tg]);

  return { tg, expand };
}
