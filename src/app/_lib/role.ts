"use client";
import { useEffect, useState } from "react";
export type Role = "seller" | "buyer" | "admin";

const KEY = "demo_role";

export function useRole() {
  const [role, setRole] = useState<Role>("buyer");
  useEffect(() => {
    const r = (localStorage.getItem(KEY) as Role) || "buyer";
    setRole(r);
  }, []);
  const change = (r: Role) => { setRole(r); localStorage.setItem(KEY, r); };
  return { role, setRole: change };
}
