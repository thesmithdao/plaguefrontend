"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export default function WalletConnection() {
  const { connected, connecting, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-32 bg-gray-700 animate-pulse rounded-lg border-2 border-gray-600"></div>
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="flex items-center">
      <WalletMultiButton
        className="!bg-orange-600 hover:!bg-orange-700 !text-white !font-bold !text-xs sm:!text-sm !px-3 sm:!px-4 !py-2 !rounded-lg !border-2 !border-orange-500 hover:!border-orange-400 !transition-all !shadow-lg !min-h-[40px] pixel-font"
        startIcon={undefined}
      >
        {connecting ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            Connecting...
          </span>
        ) : connected && publicKey ? (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {truncateAddress(publicKey.toString())}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </WalletMultiButton>
    </div>
  )
}
