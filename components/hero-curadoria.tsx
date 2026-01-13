"use client"

import { useEffect, useState } from "react"

const slides = [
  "/images/lp-shopee-hero-curadoria-origem.jpg",
  "/images/lp-shopee-hero-curadoria-recebimento.jpg",
  "/images/lp-shopee-hero-curadoria-consagracao.jpg",
]

export default function HeroCuradoria() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="w-full max-w-full overflow-x-hidden py-16 md:py-24 bg-transparent">
      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="relative w-full h-[65vh] md:h-[80vh] rounded-3xl overflow-hidden bg-black">
          {slides.map((src, i) => (
            <img
              key={src}
              src={src || "/placeholder.svg"}
              alt=""
              className={`
                absolute inset-0
                w-full h-full
                object-contain
                transition-opacity duration-1000
                ${i === index ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
      </div>
    </section>
  )
}
