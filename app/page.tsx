"use client"

import { useEffect, useMemo, useState } from "react"
import CategoriasShopping from "@/components/categorias-shopping"

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

type Slide = {
  title: string
  text: string
  image: string
}

/**
 * Slider 1-por-vez (cinematográfico)
 * - Evita o "carrossel" com várias cards
 * - Evita faixa preta / vazio
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
          {/* Brilho sutil (tecnologia sem gritar) */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />

          <div className="relative h-[270px] md:h-[340px]">
            <div key={index} className="absolute inset-0 animate-[tetel_fade_650ms_ease-in-out]">
              {/* imagem de fundo */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${current.image})` }}
              />
              {/* overlay pra legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />

              {/* conteúdo (texto não "gravado" na imagem) */}
              <div className="relative h-full flex items-center">
                <div className="px-6 md:px-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/80">
                    ✨ Clique e ganhe
                  </div>

                  <h3 className="mt-4 text-2xl md:text-3xl font-semibold leading-tight">{current.title}</h3>

                  <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">{current.text}</p>

                  <div className="mt-5 flex gap-2">
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
      {
        title: "Ganhe carinho",
        text: "Coisas que fazem quem você ama sorrir.",
        image: "/images/ganhe-carinho.jpg",
      },
      {
        title: "Ganhe escolha fácil",
        text: "Tudo já separado pra você decidir tranquilo(a).",
        image: "/images/ganhe-escolha.jpg",
      },
      {
        title: "Ganhe aquele acerto",
        text: "Quando você olha e pensa: é isso.",
        image: "/images/ganhe-acerto.jpg",
      },
      {
        title: "Ganhe satisfação",
        text: "Clicou, foi pra Shopee e resolveu.",
        image: "/images/ganhe-satisfacao.jpg",
      },
    ],
    [],
  )

  /**
   * Placeholders (MVP): você troca depois por links afiliados reais.
   */
  const achadinhos = useMemo(
    () => [
      {
        id: "a1",
        title: "Kit Volta às Aulas (básico)",
        note: "seu filho vai amar",
        badge: "Volta às Aulas",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-voltaasaulas.jpg",
      },
      {
        id: "a2",
        title: "Fones & Acessórios",
        note: "dá gosto de escolher",
        badge: "Tech",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-tecnologia.jpg",
      },
      {
        id: "a3",
        title: "Casa & Utilidades",
        note: "mimo pra sua casa",
        badge: "Casa",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-mercadoshopee.jpg",
      },
      {
        id: "a4",
        title: "Bem-estar & Saúde",
        note: "vai leve, vai feliz",
        badge: "Cupons",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-bemestar.jpg",
      },
      {
        id: "a5",
        title: "Carnaval: Brilho & Acessórios",
        note: "pra você arrasar",
        badge: "Carnaval",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-presentes.jpg",
      },
      {
        id: "a6",
        title: "Presentes criativos",
        note: "um mimo que conquista",
        badge: "Presentes",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-presentes.jpg",
      },
      {
        id: "a7",
        title: "Organizadores",
        note: "sua casa agradece",
        badge: "Casa",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-mercadoshopee.jpg",
      },
      {
        id: "a8",
        title: "Capinhas & Cabos",
        note: "pequenos acertos",
        badge: "Tech",
        url: "https://shopee.com.br",
        img: "/images/lp-shopee-categoria-tecnologia.jpg",
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
              Pegue seus cupons e descubra achadinhos que fazem bem escolher. Tudo pronto pra você ir direto pra Shopee.
            </p>

            {/* badges "em movimento" */}
            <div className="mt-7 flex items-center justify-center">
              <div className="w-full max-w-3xl overflow-hidden">
                <div className="inline-flex gap-3 animate-[marquee_18s_linear_infinite] whitespace-nowrap will-change-transform">
                  {[
                    "🎒 Volta às Aulas",
                    "🔥 Promoções",
                    "💛 Cupons ativos",
                    "⚡ Achadinhos relâmpago",
                    "🎉 Carnaval vem aí",
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
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-orange-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
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

        {/* PROVA RÁPIDA (copy mais humano) */}
        <section className="w-full pb-10">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { t: "Tá tudo mais gostoso quando já tá organizado.", i: "🔎" },
                { t: "Cupons e achadinhos que deixam a escolha leve.", i: "💛" },
                { t: "Você olha, gosta… e vai pra Shopee feliz.", i: "⚡" },
              ].map((x, idx) => (
                <div key={idx} className="bg-[#0c0d0e] border border-white/10 rounded-2xl p-5 shadow-sm">
                  <div className="text-2xl mb-2">{x.i}</div>
                  <p className="text-sm text-white/80 leading-relaxed">{x.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIQUE E GANHE (slider 1-por-vez) */}
        <CliqueEGanheSlider slides={cliqueEGanheSlides} />

        {/* ACHADINHOS */}
        <section id="achadinhos" className="w-full py-12">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">Achadinhos em destaque</h2>
                <p className="mt-1 text-sm text-white/70">Arraste pro lado e clique no que te chamou atenção.</p>
              </div>
              <div className="hidden md:block text-xs text-white/50">Arraste →</div>
            </div>

            <div
              className="
                flex gap-4
                overflow-x-auto scroll-smooth
                snap-x snap-mandatory
                [-webkit-overflow-scrolling:touch]
                pb-2
                tetel-hide-scrollbar
              "
            >
              {achadinhos.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[82%] max-w-[340px]">
                  <div className="bg-[#0c0d0e] border border-white/10 rounded-2xl overflow-hidden shadow-md h-full">
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
                        onClick={() => {
                          trackShopeeClick({
                            type: "produto",
                            section: "achadinhos_destaque",
                            product_id: p.id,
                          })
                        }}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        Ver na Shopee →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AGORA / CARNAVAL VEM AÍ (no lugar de "Sazonalidade") */}
        <section className="w-full py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Volta às Aulas */}
              <div className="bg-[#0c0d0e] border border-white/10 rounded-2xl p-6 shadow-sm">
                <p className="text-xs text-white/60">AGORA</p>
                <h3 className="text-lg font-semibold">🎒 Volta às Aulas</h3>
                <p className="mt-1 text-sm text-white/70">
                  Coisas que seu filho vai amar — e você vai amar ter escolhido.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Caderno", "Canetas", "Mochila", "Estojo"].map((x, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        trackShopeeClick({
                          type: "categoria",
                          section: "agora_volta_aulas",
                          product_id: `volta_aulas_${i}`,
                        })
                        window.open("https://shopee.com.br", "_blank", "noopener,noreferrer")
                      }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/85 hover:bg-white/10 transition-colors text-left"
                    >
                      {x} →
                    </button>
                  ))}
                </div>

                <a
                  href="https://shopee.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackShopeeClick({ type: "categoria", section: "agora_volta_aulas" })
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Ver achadinhos de Volta às Aulas →
                </a>
              </div>

              {/* Carnaval */}
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
                        trackShopeeClick({
                          type: "categoria",
                          section: "carnaval",
                          product_id: `carnaval_${i}`,
                        })
                        window.open("https://shopee.com.br", "_blank", "noopener,noreferrer")
                      }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/85 hover:bg-white/10 transition-colors text-left"
                    >
                      {x} →
                    </button>
                  ))}
                </div>

                <a
                  href="https://shopee.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackShopeeClick({ type: "categoria", section: "carnaval" })
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Ver achadinhos de Carnaval →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS (mantém componente existente) */}
        <section className="w-full py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <p className="text-xs text-white/60">ESCOLHA PELO QUE TE DÁ VONTADE</p>
            {/* Deixo o título principal pro componente, pra evitar duplicação se ele já renderiza um H2 grande */}
            <p className="mt-2 text-sm text-white/70">Um desses aqui pode ser o seu próximo achadinho.</p>
          </div>

          <CategoriasShopping />
        </section>

        {/* FINALIZAÇÃO — CUPONS */}
        <section id="cupons" className="mt-24">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-2">Vá feliz para a Shopee.</h2>
            <p className="text-white/70 mb-10">
              Ela já pensou nos mínimos detalhes para você. Agora é só ir tranquilo(a).
            </p>

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
              onClick={() =>
                trackShopeeClick({
                  type: "cupom",
                  section: "finalizacao_feliz",
                })
              }
              className="inline-flex items-center justify-center rounded-full bg-orange-500 text-black font-semibold px-10 py-4 text-lg hover:scale-105 transition"
            >
              Ir para a Shopee agora
            </a>

            <p className="mt-4 text-xs text-white/40">Aqui é só o começo. O resto acontece na Shopee.</p>
          </div>
        </section>

        <footer className="w-full py-8 px-6 bg-black/40 text-center text-white/60 text-xs md:text-sm">
          <p>© 2026 TetelPontocom. Todos os direitos reservados.</p>
          <p className="mt-2 max-w-2xl mx-auto">
            Este site não é afiliado, patrocinado ou administrado pela Shopee. Os links podem conter afiliação.
          </p>
        </footer>
      </main>

      {/* CSS keyframes + utilitários locais (V0-safe) */}
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

        /* hide scrollbar (carrosséis) */
        .tetel-hide-scrollbar::-webkit-scrollbar {
          height: 0 !important;
          width: 0 !important;
        }
        .tetel-hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  )
}
