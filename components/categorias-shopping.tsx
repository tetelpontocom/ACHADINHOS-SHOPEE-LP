"use client"

// CATEGORIAS — LP SHOPPING
// TetelPontocom | Bloco de categorias visuais com imagens

const categorias = [
  {
    nome: "Tecnologia & Acessórios",
    subtitulo: "com ofertas relâmpago ativas",
    imagem: "/images/lp-shopee-categoria-tecnologia.jpg",
    link: "https://s.shopee.com.br/7fSo5SM4H1?sub_id1=LP_SHOPEE&sub_id2=CARD_TECNO&sub_id3=PRINCIPAL",
    ctaTexto: "Ver Ofertas Relâmpago",
    ctaLink: "https://s.shopee.com.br/2VkhwEdCVg?sub_id1=LP_SHOPEE&sub_id2=CARD_TECNO&sub_id3=ACELERADOR",
  },
  {
    nome: "Bem-estar & Saúde",
    subtitulo: "inclui cupons de desconto",
    imagem: "/images/lp-shopee-categoria-bemestar.jpg",
    link: "https://s.shopee.com.br/10vuHeBleE?sub_id1=LP_SHOPEE&sub_id2=CARD_BEMESTAR&sub_id3=PRINCIPAL",
    ctaTexto: "Ver Cupons",
    ctaLink: "https://s.shopee.com.br/7KpxhvDnol?sub_id1=LP_SHOPEE&sub_id2=CARD_BEMESTAR&sub_id3=ACELERADOR",
  },
  {
    nome: "Mercado Shopee",
    subtitulo: "achadinhos e descobertas do dia",
    imagem: "/images/lp-shopee-categoria-mercadoshopee.jpg",
    link: "https://s.shopee.com.br/805ecxvo7h?sub_id1=LP_SHOPEE&sub_id2=CARD_ACHADINHOS&sub_id3=PRINCIPAL",
    ctaTexto: "Ver Achadinhos",
    ctaLink: "https://s.shopee.com.br/VzdhIz83J?sub_id1=LP_SHOPEE&sub_id2=CARD_ACHADINHOS&sub_id3=ACELERADOR",
  },
  {
    nome: "Volta às Aulas",
    subtitulo: "economize com cupons ativos",
    imagem: "/images/lp-shopee-categoria-voltaasaulas.jpg",
    link: "https://s.shopee.com.br/7pmDgk2YOy?sub_id1=LP_SHOPEE&sub_id2=CARD_PAPELARIA&sub_id3=PRINCIPAL",
    ctaTexto: "Ver Cupons",
    ctaLink: "https://s.shopee.com.br/1BFKOYVzhM?sub_id1=LP_SHOPEE&sub_id2=CARD_PAPELARIA&sub_id3=ACELERADOR",
  },
]

export default function CategoriasShopping() {
  const trackShopeeClick = (params: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).tetelEvent) {
      ;(window as any).tetelEvent("tetel_click_shopee", {
        origin: "categorias",
        campaign: "meta_ads",
        ...params,
      })
    }
  }

  return (
    <section className="w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-[100%] mx-auto px-4 flex justify-center">
        <div className="w-full max-w-[420px] md:max-w-6xl">
          <div className="w-full bg-neutral-950 py-20">
            <h2 className="text-white text-3xl font-semibold mb-10 text-center">Comece pelo que você procura</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categorias.map((cat, index) => (
                <div key={index} className="w-full max-w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
                  <a
                    href={cat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackShopeeClick({
                        type: "categoria",
                        section: "categorias_principais",
                        product_id: cat.nome.toLowerCase().replace(/\s+/g, "_"),
                      })
                    }}
                    className="block group hover:opacity-90 transition-opacity"
                  >
                    <div className="px-6 pt-4 pb-2">
                      <span className="text-xs text-white/50">Abrir categoria →</span>
                    </div>

                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 flex md:items-center md:justify-center items-start justify-center pt-4 md:pt-0">
                      <img
                        src={cat.imagem || "/placeholder.svg?height=400&width=600"}
                        alt={cat.nome}
                        className="max-h-full max-w-[85%] md:max-w-[90%] object-contain"
                      />
                    </div>

                    <div className="p-6 pb-4">
                      <h3 className="text-white text-xl font-medium mb-2">{cat.nome}</h3>
                      <p className="text-sm opacity-75 text-white/70">{cat.subtitulo}</p>
                    </div>
                  </a>

                  <div className="px-6 pb-6">
                    <a
                      href={cat.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation()
                        trackShopeeClick({
                          type: "categoria_cta",
                          section: "categorias_principais",
                          product_id: `${cat.nome.toLowerCase().replace(/\s+/g, "_")}_cta`,
                        })
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20 hover:border-orange-500/50 transition-all"
                    >
                      {cat.ctaTexto} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
