"use client"

import { useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function WalletConnection() {
  const { wallet, connect, connected, connecting, disconnect } = useWallet()

  // Auto-connect to previously connected wallet
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      try {
        connect()
      } catch (error) {
        console.log("Auto-connect failed:", error)
      }
    }
  }, [wallet, connected, connecting, connect])

  useEffect(() => {
    // Inject custom styles for the wallet button
    const style = document.createElement("style")
    style.textContent = `
      .wallet-adapter-button-trigger {
        background-color: #16a34a !important;
        border: 2px solid #22c55e !important;
        color: white !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        padding: 10px 20px !important;
        min-height: 40px !important;
        min-width: 110px !important;
        font-size: 14px !important;
      }
      
      @media (max-width: 640px) {
        .wallet-adapter-button-trigger {
          padding: 6px 12px !important;
          min-height: 32px !important;
          min-width: 75px !important;
          font-size: 12px !important;
          border-radius: 6px !important;
        }
      }
      
      .wallet-adapter-button-trigger:hover {
        background-color: #15803d !important;
        border-color: #16a34a !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2) !important;
      }
      
      .wallet-adapter-button-trigger:active {
        transform: translateY(0) !important;
      }
      
      .wallet-adapter-dropdown {
        background-color: #1f2937 !important;
        border: 1px solid #374151 !important;
        border-radius: 8px !important;
      }
      
      .wallet-adapter-dropdown-list {
        background-color: #1f2937 !important;
      }
      
      .wallet-adapter-dropdown-list-item {
        background-color: #1f2937 !important;
        color: white !important;
      }
      
      .wallet-adapter-dropdown-list-item:hover {
        background-color: #374151 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex items-center">
      {connecting ? (
        <div className="bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center h-8 w-20 sm:h-10 sm:w-28 animate-pulse">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  )
}
