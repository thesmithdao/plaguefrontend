"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export default function WalletConnection() {
  const { wallet, connected, publicKey, connect } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-connect when wallet is selected
  useEffect(() => {
    if (wallet && !connected) {
      connect().catch(() => {
        // Silently handle connection errors
      })
    }
  }, [wallet, connected, connect])

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
        background: #16a34a !important;
        border: 2px solid #22c55e !important;
        color: white !important;
        font-weight: bold !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        font-size: 14px !important;
        min-height: 44px !important;
        min-width: 120px !important;
        transition: all 0.2s ease !important;
      }
      .wallet-adapter-button:hover {
        background: #15803d !important;
        border-color: #16a34a !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3) !important;
      }
      .wallet-adapter-button:active {
        transform: translateY(0) !important;
      }
      .wallet-adapter-button:disabled {
        background: #6b7280 !important;
        border-color: #9ca3af !important;
        cursor: not-allowed !important;
        transform: none !important;
        box-shadow: none !important;
      }
      @media (max-width: 640px) {
        .wallet-adapter-button {
          padding: 10px 16px !important;
          font-size: 12px !important;
          min-height: 40px !important;
          min-width: 100px !important;
        }
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
    return <div className="h-11 w-30 animate-pulse rounded-lg bg-gray-700" />
  }

  return (
    <div className="relative flex flex-col items-end">
      <WalletMultiButton />
    </div>
  )
}
