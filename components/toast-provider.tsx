"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "oklch(0.18 0.005 260)",
          border: "1px solid oklch(0.28 0.005 260)",
          color: "oklch(0.98 0 0)",
        },
      }}
    />
  )
}
