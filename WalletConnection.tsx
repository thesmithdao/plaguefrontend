"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export default function WalletConnection() {
  const { connected, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const style = document.createElement("style")
    style.textContent = `
      header:has(.wallet-adapter-button) {
        z-index: 30 !important;
      }
      .wallet-adapter-modal-wrapper, .wallet-adapter-dropdown-list {
        z-index: 100000 !important;
      }
      .wallet-adapter-button {
        -webkit-appearance: none !important;
        appearance: none !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [mounted])

  if (!mounted) {
    return <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-700" />
  }

  return (
    <div className="relative flex flex-col items-end">
      <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-700 hover:!from-green-700 hover:!to-green-800 !text-white !font-bold !text-xs sm:!text-sm !px-3 sm:!px-4 !py-2 !rounded-lg !border-2 !border-green-500 hover:!border-green-400 !transition-all !shadow-lg !min-h-[40px]" />
    </div>
  )
}
