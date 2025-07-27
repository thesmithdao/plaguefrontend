"use client"

import { useEffect, useState, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RefreshCw, ExternalLink, Wallet, ImageIcon } from "lucide-react"

interface NFT {
  mint: string
  name: string
  image: string
  description: string
  attributes: Array<{ trait_type: string; value: string }>
  collection: string | null
}

interface NFTResponse {
  nfts: NFT[]
  total: number
  success: boolean
  error?: string
}

interface ProfileProps {
  onClose?: () => void
}

export default function Profile({ onClose }: ProfileProps) {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchNFTs = useCallback(async () => {
    if (!connected || !publicKey) {
      setNfts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/get-nfts?walletAddress=${publicKey.toString()}`)
      const data: NFTResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch NFTs")
      }

      if (data.success) {
        setNfts(data.nfts || [])
      } else {
        throw new Error(data.error || "Failed to fetch NFTs")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load NFTs")
      setNfts([])
    } finally {
      setLoading(false)
    }
  }, [connected, publicKey])

  useEffect(() => {
    if (mounted && connected && publicKey) {
      fetchNFTs()
    } else if (mounted && !connected) {
      setNfts([])
      setError(null)
    }
  }, [mounted, connected, publicKey, fetchNFTs])

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const openInSolscan = (mint: string) => {
    window.open(`https://solscan.io/token/${mint}`, "_blank")
  }

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-center text-orange-400 pixel-font">👤 PROFILE</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl font-bold">
            ×
          </button>
        </div>
      )}

      <Card className="w-full bg-gray-800/80 border border-gray-600 backdrop-blur-sm shadow-2xl flex-1">
        <CardHeader className="flex-row items-center justify-between py-3 px-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-bold text-orange-400 pixel-font">WALLET</span>
          </div>
          {connected && (
            <button
              onClick={fetchNFTs}
              disabled={loading}
              className="text-gray-400 hover:text-orange-400 transition-colors disabled:opacity-50 p-1"
              title="Refresh NFTs"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </CardHeader>

        <CardContent className="p-4 flex-1" style={{ minHeight: "300px" }}>
          {!connected ? (
            <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
              <Wallet className="h-12 w-12 text-gray-600 mb-4" />
              <p className="pixel-font text-sm mb-2">Connect your wallet to view your profile</p>
              <p className="pixel-font text-xs text-gray-500">Your PLAGUE NFTs will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Wallet Info */}
              <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 pixel-font mb-1">CONNECTED WALLET</p>
                    <p className="text-sm text-white pixel-font font-mono">
                      {publicKey ? truncateAddress(publicKey.toString()) : ""}
                    </p>
                  </div>
                  {publicKey && (
                    <button
                      onClick={() => window.open(`https://solscan.io/account/${publicKey.toString()}`, "_blank")}
                      className="text-gray-400 hover:text-orange-400 transition-colors p-1"
                      title="View on Solscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* NFTs Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-orange-400" />
                  <h3 className="text-sm font-bold text-orange-400 pixel-font">PLAGUE COLLECTION</h3>
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full text-xs pixel-font">
                    {nfts.length}
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-gray-400 text-xs pixel-font">Loading NFTs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-400 text-xs pixel-font mb-2">❌ {error}</p>
                    <button
                      onClick={fetchNFTs}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors pixel-font"
                    >
                      Retry
                    </button>
                  </div>
                ) : nfts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-700/30 rounded-lg border border-gray-600">
                    <ImageIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs pixel-font mb-1">No PLAGUE NFTs found</p>
                    <p className="text-gray-500 text-xs pixel-font">
                      Get your PLAGUE NFTs to unlock exclusive features!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    <style jsx>{`
                      .grid::-webkit-scrollbar {
                        width: 6px;
                      }
                      .grid::-webkit-scrollbar-track {
                        background: #374151;
                        border-radius: 3px;
                      }
                      .grid::-webkit-scrollbar-thumb {
                        background: #fb923c;
                        border-radius: 3px;
                      }
                      .grid::-webkit-scrollbar-thumb:hover {
                        background: #f97316;
                      }
                    `}</style>
                    {nfts.map((nft) => (
                      <div
                        key={nft.mint}
                        className="bg-gray-700/50 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group"
                        onClick={() => openInSolscan(nft.mint)}
                      >
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                          <img
                            src={nft.image || "/placeholder.svg"}
                            alt={nft.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=150&width=150&text=PLAGUE"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-white pixel-font truncate" title={nft.name}>
                            {nft.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
