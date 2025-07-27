import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import WalletProvider from "../WalletProvider"
import CookieConsent from "../CookieConsent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PLAGUE Labs - Web3 Marketing Agency",
  description:
    "A web3 marketing agency focused on memetic languages. Viral marketing, community management, and growth strategies for decentralized projects.",
  keywords: "web3, marketing, blockchain, NFT, Solana, viral marketing, community management, memetic",
  authors: [{ name: "PLAGUE Labs" }],
  creator: "PLAGUE Labs",
  publisher: "PLAGUE Labs",
  openGraph: {
    title: "PLAGUE Labs - Web3 Marketing Agency",
    description:
      "A web3 marketing agency focused on memetic languages. Viral marketing, community management, and growth strategies for decentralized projects.",
    url: "https://plague-labs.com",
    siteName: "PLAGUE Labs",
    images: [
      {
        url: "/images/logo-oficial.png",
        width: 1200,
        height: 630,
        alt: "PLAGUE Labs Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLAGUE Labs - Web3 Marketing Agency",
    description:
      "A web3 marketing agency focused on memetic languages. Viral marketing, community management, and growth strategies for decentralized projects.",
    images: ["/images/logo-oficial.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WalletProvider>
            {children}
            <Toaster />
            <CookieConsent />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
