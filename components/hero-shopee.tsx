"use client"

import { useState, useEffect } from "react"

const heroFrames = [
  "/images/hero-shopee-frame-1.png",
  "/images/hero-shopee-frame-2.png",
  "/images/hero-shopee-frame-3.png",
  "/images/hero-shopee-frame-4.png",
  "/images/hero-shopee-frame-5.png",
]

export default function HeroShopee() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroFrames.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background image carousel */}
      {heroFrames.map((frame, index) => (
        <div
          key={frame}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={frame || "/placeholder.svg"}
            alt={`Shopee Hero ${index + 1}`}
            className="hero-image w-full h-full object-cover object-center"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-20 text-center">
        <h1
          className="text-white text-3xl md:text-5xl font-semibold leading-tight"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          Clique, economize e ainda concorra a recompensas de verdade.
        </h1>

        <p className="mt-4 text-white/80 text-base md:text-lg" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          Você compra normalmente na Shopee. <br />
          Nós apenas te damos acesso às melhores seleções, cupons e benefícios do Ecossistema TetelPontocom — sem custo
          extra.
        </p>

        <a
          href="https://s.shopee.com.br/8AP48CmyxJ?sub_id1=LP_SHOPEE&sub_id2=HERO&sub_id3=PRINCIPAL"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).tetelEvent) {
              ;(window as any).tetelEvent("tetel_ic", { target: "shopee" })
              ;(window as any).tetelEvent("tetel_outbound_shopee")
            }
          }}
          className="mt-8 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#F97316] text-white font-medium text-base hover:bg-[#fb7a24] transition-colors whitespace-nowrap"
        >
          Ver Seleções na Shopee
        </a>

        <p
          className="mt-4 text-xs md:text-sm text-white/60 max-w-xl mx-auto"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          Você compra normalmente pela Shopee. Nós transformamos essas compras em recompensas, sem você pagar nada a
          mais por isso.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
