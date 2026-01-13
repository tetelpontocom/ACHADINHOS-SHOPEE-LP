"use client"

import type React from "react"

export default function MobileHorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-hidden md:overflow-visible px-4 md:px-0">
      <div className="flex md:grid md:grid-cols-3 gap-4 snap-x snap-mandatory md:snap-none">{children}</div>
    </div>
  )
}
