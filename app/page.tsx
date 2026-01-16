"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

declare global {
  interface Window {
    fbq: any
    _fbq: any
    tetelEvent: any
  }
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

/**
 * Pixel/Event bridge (mantém seu padrão atual)
 */
function tetelEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return

  try {
    if (window.fbq) {
      window.fbq("trackCustom", eventName, {
        ...params,
        ecosystem: "TetelPontocom",
        pixel_id: "1305167264321996",
      })
    }
  } catch (err) {
    console.warn("Pixel TetelPontocom não executado", err)
  }
}

/**
 * Helper: clique para Shopee = proxy de intenção
 */
function trackShopeeClick(params: Record<string, any>) {
  tetelEvent("tetel_click_shopee", {
    origin: "achadinhos",
    campaign: "meta_ads",
    ...params,
  })
}

/**
 * Util: scroll suave (sem libs)
 */
function scrollToId(id: string) {
  if (typeof window === "undefined") return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Abrir Shopee por busca (explica melhor os botões "Caderno / Canetas / ...")
 */
function openShopeeSearch(keyword: string) {
  const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(keyword)}`
  window.open(url, "_blank", "noopener,noreferrer")
}

type Slide = {
  title: string
  text: string
  image: string
}

/**
 * Slider 1-por-vez (cinematográfico) com imagem "mais distante"
 * - Fundo: cover + blur (clima)
 * - Frente: contain (aparece mais da imagem; evita cortar rosto/olhos)
 * - V0-safe (interval no useEffect)
 */
function CliqueEGanheSlider({
  slides,
  intervalMs = 2600,
}: {
  slides: Slide[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!slides?.length) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [slides, intervalMs])

  const current = slides[index] || slides[0]

  return (
    <section className="w-full py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Clique e ganhe.</h2>
        <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
          Ganhos pequenos que mudam o clima. Você clica mais leve — e vai feliz pra Shopee.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg">
          {/* brilho sutil */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative h-[280px] md:h-[360px]">
            <div key={index} className="absolute inset-0 animate-[tetel_fade_650ms_ease-in-out]">
              {/* fundo (cover + blur) */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-[10px] scale-[1.08] opacity-70"
                style={{ backgroundImage: `url(${current.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />

              {/* imagem (contain) pra não cortar rosto/olhos */}
              <div className="absolute inset-0 flex items-center justify-end pr-0 md:pr-8">
                <div className="relative w-full md:w-[52%] h-full">
                  <img
                    src={current.image || "/placeholder.svg"}
                    alt={current.title}
                    className="w-full h-full object-contain opacity-95 animate-[tetel_kb_7s_ease-in-out_infinite]"
                  />
                </div>
              </div>

              <div className="relative h-full flex items-center">
                <div className="px-6 md:px-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/80">
                    ✨ Clique e ganhe
                  </div>

                  <h3 className="mt-4 text-2xl md:text-3xl font-semibold leading-tight">{current.title}</h3>

                  <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">{current.text}</p>

                  <div className="mt-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => scrollToId("achadinhos")}
                      className="px-5 py-3 rounded-full bg-orange-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Ver achadinhos ⚡
                    </button>

                    <button
                      onClick={() => scrollToId("cupons")}
                      className="px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                    >
                      Ver cupons →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* dots */}
          <div className="flex items-center justify-center gap-2 py-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  i === index ? "w-8 bg-orange-500" : "w-2.5 bg-white/20 hover:bg-white/30",
                ].join(" ")}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Carrossel de achadinhos:
 * - Mobile: auto-scroll 1 card por vez (cara de achadinho)
 * - Desktop: manual, com "click-drag" (arrasta com mouse)
 */
function AchadinhosCarousel({
  items,
  onClickItem,
}: {
  items: Array<{
    id: string
    title: string
    note: string
    badge: string
    url: string
    img: string
  }>
  onClickItem: (id: string) => void
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const drag = useRef<{ down: boolean; startX: number; startLeft: number }>({
    down: false,
    startX: 0,
    startLeft: 0,
  })

  const [canScroll, setCanScroll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(!!mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const update = () => setCanScroll(el.scrollWidth > el.clientWidth + 4)
    update()

    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  // Auto-scroll mobile: 1 card por vez
  useEffect(() => {
    if (!isMobile) return
    const el = scrollerRef.current
    if (!el) return

    const tick = () => {
      const kids = Array.from(el.children) as HTMLElement[]
      if (!kids.length) return

      const currentLeft = el.scrollLeft
      let nearestIndex = 0
      let nearestDist = Number.POSITIVE_INFINITY
      for (let i = 0; i < kids.length; i++) {
        const d = Math.abs(kids[i].offsetLeft - currentLeft)
        if (d < nearestDist) {
          nearestDist = d
          nearestIndex = i
        }
      }

      const nextIndex = (nearestIndex + 1) % kids.length
      const next = kids[nextIndex]
      el.scrollTo({ left: next.offsetLeft, behavior: "smooth" })
    }

    const t = window.setInterval(tick, 2300)
    return () => window.clearInterval(t)
  }, [isMobile])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el) return
    drag.current.down = true
    drag.current.startX = e.clientX
    drag.current.startLeft = el.scrollLeft
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {}
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el) return
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    el.scrollLeft = drag.current.startLeft - dx
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.down = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {}
  }

  return (
    <div className="relative">
      {canScroll && <div className="hidden md:block absolute right-0 -top-6 text-xs text-white/50">Arraste →</div>}

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={[
          "flex gap-4",
          "overflow-x-auto scroll-smooth",
          "snap-x snap-mandatory",
          "pb-2",
          "tetel-hide-scrollbar tetel-scroll-touch",
          canScroll ? "cursor-grab active:cursor-grabbing" : "",
        ].join(" ")}
      >
        {items.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[82%] max-w-[340px]">
            <div className="bg-[#0c0d0e] border border-white/10 rounded-2xl overflow-hidden shadow-md h-full hover:translate-y-[-2px] transition-transform">
              <div className="relative">
                <div className="w-full aspect-[4/3] bg-black/40 overflow-hidden">
                  <img src={p.img || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover" />
                </div>

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-xs text-white/85">
                  {p.badge}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.note}</p>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onClickItem(p.id)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Ver na Shopee →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canScroll && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#050607] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#050607] to-transparent" />
        </>
      )}
    </div>
  )
}

type CategoryCard = {
  id: string
  title: string
  subtitle: string
  keyword: string
  badge: string
  img?: string
}

export default function Page({ searchParams }: PageProps) {
  const [fromTetel, setFromTetel] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      const fromParam = url.searchParams.get("from")
      if (fromParam && fromParam.toLowerCase().includes("tetel")) {
        setFromTetel(true)
      }
    }
  }, [])

  useEffect(() => {
    tetelEvent("tetel_pageview")
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).tetelEvent = tetelEvent
    }
  }, [])

  const cliqueEGanheSlides = useMemo<Slide[]>(
    () => [
      { title: "Ganhe carinho", text: "Coisas que fazem quem você ama sorrir.", image: "/images/ganhe-carinho.jpg" },
      {
        title: "Ganhe escolha fácil",
        text: "Tudo já separado pra você decidir tranquilo(a).",
        image: "/images/ganhe-escolha.jpg",
      },
      { title: 'Ganhe aquele "acerto"', text: "Quando você olha e pensa: é isso.", image: "/images/ganhe-acerto.jpg" },
      { title: "Ganhe satisfação", text: "Clicou, foi pra Shopee e resolveu.", image: "/images/ganhe-satisfacao.jpg" },
    ],
    [],
  )

  /**
   * Achadinhos destaque (vitrine)
   * - sem "básico"
   * - casa sem cara de limpeza (trocar imagem depois; deixei placeholder seguro)
   */
  const achadinhos = useMemo(
    () => [
      {
        id: "a1",
        title: "Kit Volta às Aulas",
        note: "seu filho vai chegar diferente na escola.",
        badge: "Volta às Aulas",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-voltaasaulas.jpg",
      },
      {
        id: "a2",
        title: "Fones & Acessórios",
        note: "pequenos acertos que dá gosto de escolher.",
        badge: "Tech",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-tecnologia.jpg",
      },
      {
        id: "a3",
        title: "Casa: Conforto & Decoração",
        note: "coisas que deixam a casa gostosa de estar.",
        badge: "Casa",
        url: "https://shopee.com.br",
        img: "/placeholder.svg",
      },
      {
        id: "a4",
        title: "Beleza & Autocuidado",
        note: "um mimo que levanta o astral na hora.",
        badge: "Beleza",
        url: "https://shopee.com.br",
        img: "/placeholder.svg",
      },
      {
        id: "a5",
        title: "Moda que dá vontade",
        note: "uma peça baratinha que muda tudo.",
        badge: "Moda",
        url: "https://shopee.com.br",
        img: "/placeholder.svg",
      },
      {
        id: "a6",
        title: "Brinquedos & Fofuras",
        note: "um achado que vira presente na hora.",
        badge: "Kids",
        url: "https://shopee.com.br",
        img: "/placeholder.svg",
      },
    ],
    [],
  )

  /**
   * Cards "estilo Shopee" (8 categorias prontas)
   * - clique abre busca pronta na Shopee
   * - evento de clique padronizado
   */
  const categorias = useMemo<CategoryCard[]>(
    () => [
      {
        id: "c1",
        title: "Beleza & Autocuidado",
        subtitle: "um mimo fácil pra você se sentir melhor hoje.",
        keyword: "beleza maquiagem skincare",
        badge: "🔥 Vende muito",
        img: "/placeholder.svg",
      },
      {
        id: "c2",
        title: "Moda & Acessórios",
        subtitle: "uma peça que você veste e já se sente outra pessoa.",
        keyword: "moda feminina acessorios",
        badge: "✨ Estilo",
        img: "/placeholder.svg",
      },
      {
        id: "c3",
        title: "Casa & Decoração",
        subtitle: "coisas bonitas que dão prazer de ter em casa.",
        keyword: "decoracao casa organizacao",
        badge: "🏠 Casa gostosa",
        img: "/placeholder.svg",
      },
      {
        id: "c4",
        title: "Cozinha & Organização",
        subtitle: "achados úteis que parecem caros — mas não são.",
        keyword: "organizadores cozinha",
        badge: "✅ Útil",
        img: "/placeholder.svg",
      },
      {
        id: "c5",
        title: "Tech & Gadgets",
        subtitle: "coisas que você compra e já quer mostrar.",
        keyword: "gadget fone bluetooth smartwatch",
        badge: "⚡ Tech",
        img: "/images/lp-shopee-categoria-tecnologia.jpg",
      },
      {
        id: "c6",
        title: "Volta às Aulas",
        subtitle: "pra seu filho chegar diferente — e amar.",
        keyword: "volta as aulas mochila estojo caderno",
        badge: "🎒 Agora",
        img: "/images/lp-shopee-categoria-voltaasaulas.jpg",
      },
      {
        id: "c7",
        title: "Fitness & Bem-estar",
        subtitle: "leve e gostoso: academia, garrafa, acessórios.",
        keyword: "acessorios academia garrafa squeeze",
        badge: "💪 Leve",
        img: "/placeholder.svg",
      },
      {
        id: "c8",
        title: "Pets",
        subtitle: "um agrado pro seu pet… e pronto, você ganhou o dia.",
        keyword: "acessorios pet",
        badge: "🐾 Fofo",
        img: "/placeholder.svg",
      },
    ],
    [],
  )

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      {fromTetel && (
        <header className="w-full bg-gradient-to-r from-red-600 to-red-700 py-3 text-center text-white text-sm font-medium shadow-md">
          ⚡ Você veio pelo TetelPontocom — achadinhos organizados te esperando.
        </header>
      )}

      <main className="w-full flex flex-col bg-[#050607] text-white font-sans">
        {/* HERO */}
        <section className="relative w-full pt-16 pb-12 md:pt-20 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl bg-white/10" />
            <div className="absolute -bottom-64 left-0 w-[700px] h-[700px] rounded-full blur-3xl bg-white/5" />
            <div className="absolute top-1/3 right-[-120px] w-[420px] h-[420px] rounded-full blur-3xl bg-orange-500/10" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
            <h1 className="text-[30px] md:text-[46px] font-semibold leading-tight">
              Achadinhos da Shopee, do jeito que dá vontade de clicar.
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Pegue seus cupons e descubra achadinhos que deixam a escolha gostosa. Tudo pronto pra você ir direto pra
              Shopee.
            </p>

            {/* badges em movimento + fade nas bordas */}
            <div className="mt-7 flex items-center justify-center">
              <div className="relative w-full max-w-3xl overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#050607] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#050607] to-transparent z-10" />

                <div className="inline-flex gap-3 animate-[marquee_18s_linear_infinite] whitespace-nowrap will-change-transform">
                  {[
                    "🎒 Volta às Aulas",
                    "🔥 Promoções",
                    "💛 Cupons ativos",
                    "⚡ Achadinhos relâmpago",
                    "🎉 Carnaval vem aí",
                    "✨ Beleza",
                    "🛍️ Moda",
                    "🐾 Pets",
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                  {[
                    "🎒 Volta às Aulas",
                    "🔥 Promoções",
                    "💛 Cupons ativos",
                    "⚡ Achadinhos relâmpago",
                    "🎉 Carnaval vem aí",
                    "✨ Beleza",
                    "🛍️ Moda",
                    "🐾 Pets",
                  ].map((t, i) => (
                    <span
                      key={`dup-${i}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => scrollToId("achadinhos")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-orange-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity animate-[tetel_cta_2.6s_ease-in-out_infinite]"
              >
                Ver achadinhos agora
              </button>

              <button
                onClick={() => scrollToId("cupons")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
              >
                Ver cupons →
              </button>
            </div>

            <p className="mt-4 text-xs text-white/50">Dica: clique em um item e já vai pra Shopee no clima certo.</p>
          </div>
        </section>

        {/* PROVA RÁPIDA */}
        <section className="w-full pb-10">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { t: "Tá tudo mais gostoso quando já tá organizado.", i: "🔎" },
                { t: "Cupons e achadinhos que deixam a escolha leve.", i: "💛" },
                { t: "Você olha, gosta… e vai pra Shopee feliz.", i: "⚡" },
              ].map((x, idx) => (
                <div
                  key={idx}
                  className="bg-[#0c0d0e] border border-white/10 rounded-2xl p-5 shadow-sm hover:bg-white/[0.06] transition-colors"
                >
                  <div className="text-2xl mb-2">{x.i}</div>
                  <p className="text-sm text-white/80 leading-relaxed">{x.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIQUE E GANHE */}
        <CliqueEGanheSlider slides={cliqueEGanheSlides} />

        {/* ACHADINHOS */}
        <section id="achadinhos" className="w-full py-12">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">Achadinhos em destaque</h2>
                <p className="mt-1 text-sm text-white/70">No celular, passa sozinho. No computador, dá pra arrastar.</p>
              </div>
            </div>

            <AchadinhosCarousel
              items={achadinhos}
              onClickItem={(id) => {
                trackShopeeClick({ type: "produto", section: "achadinhos_destaque", product_id: id })
              }}
            />
          </div>
        </section>

        {/* AGORA / CARNAVAL */}
        <section className="w-full py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0c0d0e] border border-white/10 rounded-2xl p-6 shadow-sm">
                <p className="text-xs text-white/60">AGORA</p>
                <h3 className="text-lg font-semibold">🎒 Volta às Aulas</h3>
                <p className="mt-1 text-sm text-white/70">Seu filho vai amar — e você vai amar ter escolhido.</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Caderno", "Canetas", "Mochila", "Estojo"].map((x, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        trackShopeeClick({ type: "busca", section: "agora_volta_aulas", keyword: x })
                        openShopeeSearch(x)
                      }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/85 hover:bg-white/10 transition-colors text-left"
                      title="Abre uma busca pronta na Shopee"
                    >
                      {x} →
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    trackShopeeClick({ type: "categoria", section: "agora_volta_aulas", keyword: "volta as aulas" })
                    openShopeeSearch("volta as aulas mochila estojo caderno")
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Ver achadinhos de Volta às Aulas →
                </button>

                <p className="mt-3 text-xs text-white/45">Os botões acima abrem uma busca pronta na Shopee.</p>
              </div>

              <div className="bg-[#0c0d0e] border border-white/10 rounded-2xl p-6 shadow-sm">
                <p className="text-xs text-white/60">CARNAVAL VEM AÍ</p>
                <h3 className="text-lg font-semibold">🎉 Carnaval</h3>
                <p className="mt-1 text-sm text-white/70">
                  Brilho, acessórios e achadinhos pra você arrasar — do seu jeito.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Glitter", "Tiaras", "Fantasia", "Adesivos"].map((x, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        trackShopeeClick({ type: "busca", section: "carnaval", keyword: x })
                        openShopeeSearch(x)
                      }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/85 hover:bg-white/10 transition-colors text-left"
                      title="Abre uma busca pronta na Shopee"
                    >
                      {x} →
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    trackShopeeClick({ type: "categoria", section: "carnaval", keyword: "carnaval" })
                    openShopeeSearch("carnaval glitter tiara fantasia acessorios")
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Ver achadinhos de Carnaval →
                </button>

                <p className="mt-3 text-xs text-white/45">Os botões acima abrem uma busca pronta na Shopee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS (8 cards, vibe Shopee) */}
        <section className="w-full py-12">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Comece pelo que você procura</h2>
            <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
              Escolhe uma e já vai pra Shopee no caminho mais curto.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categorias.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#0c0d0e] border border-white/10 rounded-2xl overflow-hidden shadow-sm hover:translate-y-[-2px] transition-transform"
                >
                  <div className="relative">
                    <div className="w-full aspect-[4/3] bg-black/40 overflow-hidden">
                      <img src={c.img || "/placeholder.svg"} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-xs text-white/85">
                      {c.badge}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold leading-snug">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{c.subtitle}</p>

                    <button
                      onClick={() => {
                        trackShopeeClick({
                          type: "categoria",
                          section: "comece_pelo_que_procura",
                          category_id: c.id,
                          keyword: c.keyword,
                        })
                        openShopeeSearch(c.keyword)
                      }}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                    >
                      Ver na Shopee →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["cupom shopee", "frete grátis shopee", "oferta relâmpago shopee", "moedas shopee"].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    trackShopeeClick({ type: "busca", section: "chips_rapidos", keyword: k })
                    openShopeeSearch(k)
                  }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors"
                >
                  {k} →
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FINALIZAÇÃO — CUPONS */}
        <section id="cupons" className="mt-10 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-2">A Shopee pensou nos mínimos detalhes pra você.</h2>
            <p className="text-white/70 mb-10">Só vai. Agora é só ir tranquilo(a).</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold">🚚 Frete especial</h3>
                <p className="text-sm text-white/70 mt-2">Quando está disponível, a Shopee aplica.</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold">💛 Cupons ativos</h3>
                <p className="text-sm text-white/70 mt-2">Os que realmente estão funcionando.</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold">⚡ Achadinhos relâmpago</h3>
                <p className="text-sm text-white/70 mt-2">Aqueles que aparecem e somem.</p>
              </div>
            </div>

            <a
              href="https://shopee.com.br"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackShopeeClick({ type: "cta_final", section: "finalizacao_so_vai" })}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 text-black font-semibold px-10 py-4 text-lg hover:scale-105 transition"
            >
              Ir para a Shopee agora
            </a>

            <p className="mt-4 text-xs text-white/40">Aqui é só o clima. O resto acontece na Shopee.</p>
          </div>
        </section>

        <footer className="w-full py-8 px-6 bg-black/40 text-center text-white/60 text-xs md:text-sm">
          <p>© 2026 TetelPontocom. Todos os direitos reservados.</p>
          <p className="mt-2 max-w-2xl mx-auto">
            Este site não é afiliado, patrocinado ou administrado pela Shopee. Os links podem conter afiliação.
          </p>
        </footer>
      </main>

      {/* CSS local (Safe Mode) */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes tetel_fade {
          0% {
            opacity: 0;
            transform: scale(1.01);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes tetel_kb {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes tetel_cta {
          0% {
            box-shadow: 0 0 0 rgba(249, 115, 22, 0);
          }
          50% {
            box-shadow: 0 0 28px rgba(249, 115, 22, 0.22);
          }
          100% {
            box-shadow: 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        /* esconder scrollbar dos carrosséis */
        .tetel-hide-scrollbar::-webkit-scrollbar {
          height: 0 !important;
          width: 0 !important;
        }
        .tetel-hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tetel-scroll-touch {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  )
}
