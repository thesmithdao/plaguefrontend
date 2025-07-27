"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Wallet, ChevronDown, LogOut } from "lucide-react"

export default function WalletConnection() {
  const { wallet, publicKey, connected, connecting, disconnect, select, wallets } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-connect when wallet is selected
  useEffect(() => {
    if (wallet && !connected && !connecting && mounted) {
      // Small delay to ensure wallet is properly initialized
      const timer = setTimeout(() => {
        wallet.adapter.connect().catch(() => {
          // Silent error handling - wallet connection failed
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [wallet, connected, connecting, mounted])

  const handleWalletSelect = (walletName: string) => {
    const selectedWallet = wallets.find((w) => w.adapter.name === walletName)
    if (selectedWallet) {
      select(selectedWallet.adapter.name)
      setIsOpen(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!mounted) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 min-w-[140px] h-10 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (connected && publicKey) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-700 border border-green-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors min-w-[140px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">{truncateAddress(publicKey.toString())}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px]">
            <div className="p-3 border-b border-gray-600">
              <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
              <div className="text-sm text-white font-medium">{wallet?.adapter.name}</div>
              <div className="text-xs text-gray-300 font-mono mt-1">{publicKey.toString()}</div>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        )}

        {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="bg-orange-600 border border-orange-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 min-w-[140px] justify-center">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">Connect Wallet</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px]">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Select Wallet</div>
            {wallets
              .filter((wallet) => wallet.readyState === "Installed")
              .map((wallet) => (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-3"
                >
                  <img src={wallet.adapter.icon || "/placeholder.svg"} alt={wallet.adapter.name} className="w-5 h-5" />
                  {wallet.adapter.name}
                </button>
              ))}
            {wallets.filter((wallet) => wallet.readyState === "NotDetected").length > 0 && (
              <>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="text-xs text-gray-400 mb-2 px-2">Not Installed</div>
                {wallets
                  .filter((wallet) => wallet.readyState === "NotDetected")
                  .map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => window.open(wallet.adapter.url, "_blank")}
                      className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 rounded transition-colors flex items-center gap-3"
                    >
                      <img
                        src={wallet.adapter.icon || "/placeholder.svg"}
                        alt={wallet.adapter.name}
                        className="w-5 h-5 opacity-50"
                      />
                      <span>{wallet.adapter.name}</span>
                      <span className="text-xs ml-auto">Install</span>
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
