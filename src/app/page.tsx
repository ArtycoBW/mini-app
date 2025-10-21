"use client";
import { useEffect } from "react";
import { useRole } from "./_lib/role";
import { useRouter } from "next/navigation";
import { useTelegram } from "./_lib/useTelegram";

export default function Home() {
  useTelegram();
  const { role } = useRole();
  const router = useRouter();
  useEffect(() => {
    if (role === "seller") router.replace("/seller");
    else if (role === "admin") router.replace("/admin/moderation");
    else router.replace("/buyer");
  }, [role, router]);
  return null;
}
