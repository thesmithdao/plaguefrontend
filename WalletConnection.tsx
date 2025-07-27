"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState, useRef } from "react"

export default function WalletConnection() {
  const { wallet, connected, publicKey, disconnect, connect } = useWallet()
  const [mounted, setMounted] = useState(false)
  const previousPublicKeyRef = useRef<string | null>(null)
  const isReconnectingRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle wallet account changes (when user switches accounts in Phantom)
  useEffect(() => {
    if (!publicKey || !connected) {
      previousPublicKeyRef.current = null
      return
    }

    const currentPublicKey = publicKey.toBase58()

    // If the public key changed and we were previously connected to a different account
    if (
      previousPublicKeyRef.current &&
      previousPublicKeyRef.current !== currentPublicKey &&
      !isReconnectingRef.current
    ) {
      isReconnectingRef.current = true

      // Disconnect and reconnect to refresh the connection with new account
      disconnect().then(() => {
        setTimeout(() => {
          connect()
            .catch((error) => {
              // console.error("Failed to reconnect after account change:", error)
            })
            .finally(() => {
              isReconnectingRef.current = false
            })
        }, 500)
      })
    }

    previousPublicKeyRef.current = currentPublicKey
  }, [publicKey, connected, disconnect, connect])

  // Listen for Phantom account changes
  useEffect(() => {
    if (typeof window === "undefined") return

    const phantom = (window as any).phantom?.solana
    if (!phantom) return

    const handleAccountChanged = (publicKey: any) => {
      // console.log("Phantom account changed externally:", publicKey?.toString())

      if (connected && !isReconnectingRef.current) {
        isReconnectingRef.current = true

        // Force a clean reconnection
        disconnect().then(() => {
          setTimeout(() => {
            connect()
              .catch((error) => {
                // console.error("Failed to reconnect after external account change:", error)
              })
              .finally(() => {
                isReconnectingRef.current = false
              })
          }, 500)
        })
      }
    }

    // Listen for account changes in Phantom
    phantom.on("accountChanged", handleAccountChanged)

    return () => {
      phantom.removeListener("accountChanged", handleAccountChanged)
    }
  }, [connected, disconnect, connect])

  useEffect(() => {
    if (wallet && !connected && !isReconnectingRef.current) {
      // Auto-connect immediately when a wallet is selected
      connect().catch((error) => {
        // console.error("Failed to auto-connect:", error)
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
