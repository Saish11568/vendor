"use client"

import { useStore } from "@/lib/store"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

export function GlobalToast() {
  const { toasts } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border border-border bg-card text-foreground min-w-[320px] max-w-[420px] animate-in slide-in-from-right-5 fade-in duration-300"
          style={{ animationFillMode: "forwards" }}
        >
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
          {toast.type === "error" && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
          {toast.type === "info" && <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
