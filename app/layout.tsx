import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shopee Recompensas Exclusivas | TetelPontocom",
  description: "Compre na Shopee e ganhe recompensas exclusivas TetelPontocom. MinhaIA Premium, sorteios e muito mais!",
  generator: "v0.app",
  icons: {
    icon: "/images/s-c3-admbolo-tetelpontocom.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
