/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    tg?.ready();
    tg?.expand?.();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Mini App</h1>
      <p className="mt-2">Стартовый экран Telegram WebApp</p>
    </main>
  );
}
