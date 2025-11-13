import * as React from "react"

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-xl border bg-white p-3 text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 ${props.className ?? ""}`} />
}
