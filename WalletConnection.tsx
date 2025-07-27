"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export default function WalletConnection() {
  const { wallet, connected } = useWallet()
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
        font-size: 12px !important;
        padding: 8px 12px !important;
        min-height: 36px !important;
        white-space: nowrap !important;
      }
      @media (min-width: 640px) {
        .wallet-adapter-button {
          font-size: 14px !important;
          padding: 10px 16px !important;
          min-height: 40px !important;
        }
      }
      .wallet-adapter-button-trigger {
        background: linear-gradient(to right, #16a34a, #15803d) !important;
        border: 2px solid #22c55e !important;
        border-radius: 8px !important;
        color: white !important;
        font-weight: bold !important;
        transition: all 0.2s !important;
      }
      .wallet-adapter-button-trigger:hover {
        background: linear-gradient(to right, #15803d, #166534) !important;
        border-color: #4ade80 !important;
      }
      .wallet-adapter-dropdown-list {
        background: #1f2937 !important;
        border: 1px solid #374151 !important;
        border-radius: 8px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
      }
      .wallet-adapter-dropdown-list-item {
        color: white !important;
        padding: 12px 16px !important;
        font-size: 14px !important;
      }
      .wallet-adapter-dropdown-list-item:hover {
        background: #374151 !important;
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
    return <div className="h-9 w-28 sm:h-10 sm:w-36 animate-pulse rounded-lg bg-gray-700" />
  }

  return (
    <div className="relative flex flex-col items-end">
      <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-700 hover:!from-green-700 hover:!to-green-800 !text-white !font-bold !text-xs sm:!text-sm !px-3 sm:!px-4 !py-2 !rounded-lg !border-2 !border-green-500 hover:!border-green-400 !transition-all !shadow-lg !min-h-[36px] sm:!min-h-[40px] !whitespace-nowrap" />
    </div>
  )
}
