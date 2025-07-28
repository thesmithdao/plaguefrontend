"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Share2,
  RefreshCw,
  AlertTriangle,
  WormIcon as Virus,
  Syringe,
} from "lucide-react"

interface NFT {
  name: string
  image: string
  mint: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

interface ProfileProps {
  onClose: () => void
}

export default function Profile({ onClose }: ProfileProps) {
  const { publicKey, disconnect } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (publicKey) {
      fetchNFTs()
    }
  }, [publicKey])

  const fetchNFTs = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/get-nfts?walletAddress=${publicKey.toString()}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.success) {
        throw new Error("API returned unsuccessful response")
      }

      setNfts(data.nfts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch NFTs")
    } finally {
      setLoading(false)
    }
  }

  const nextNFT = () => {
    setCurrentIndex((prev) => (prev + 1) % nfts.length)
  }

  const prevNFT = () => {
    setCurrentIndex((prev) => (prev - 1 + nfts.length) % nfts.length)
  }

  const shareInfection = () => {
    const text = `I'm infected with ${nfts.length} Plague specimens! 🦠 Check out my collection: ${window.location.href}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, "_blank")
  }

  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  if (!publicKey) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl max-h-[85vh] overflow-y-auto w-full px-6 py-1.5 mx-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-8">
            <Syringe className="h-8 w-8 text-green-400 mx-auto mb-4" />
            <p className="text-gray-300">Connect your wallet to see your Plague NFTs</p>
            <p className="text-gray-400 text-sm mt-2">No wallet connected</p>
            <a
              href="https://magiceden.io/marketplace/plagueproject"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Get Plague NFTs on Magic Eden
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full h-full sm:max-w-3xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Patient Info */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-green-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Patient ID</h3>
                <p className="text-gray-300 text-sm font-mono break-all">
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </p>
              </div>
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Specimen Count</h3>
                <p className="text-white text-2xl font-bold">{nfts.length}</p>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <button
                  onClick={shareInfection}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share Infection
                </button>
              </div>
            </div>
          </div>

          {/* NFT Gallery */}
          {loading ? (
            <div className="text-center py-8">
              <div className="relative bg-gray-800/50 rounded-lg p-4 border-green-500/20 border-0"></div>
              <p className="text-gray-300 mt-2">Analyzing specimens...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 mb-4">Error: {error}</p>
              <button
                onClick={fetchNFTs}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Analysis
              </button>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8">
              <Virus className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-300 mb-2">No Plague specimens detected.</p>
              <p className="text-gray-400 text-sm mb-4">Patient appears to be uninfected.</p>
              <a
                href="https://magiceden.io/marketplace/plagueproject"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Get Plague NFTs on Magic Eden
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold text-lg">NFT Gallery</h3>

              {/* Current NFT Display */}
              <div className="relative bg-gray-800/50 rounded-lg p-4 border-green-500/20 border-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">{nfts[currentIndex]?.name || "Unknown Specimen"}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      {currentIndex + 1} of {nfts.length}
                    </span>
                    <a
                      href={`https://solscan.io/token/${nfts[currentIndex]?.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={nfts[currentIndex]?.image || "/placeholder.svg?height=256&width=256&text=Plague"}
                      alt={nfts[currentIndex]?.name || "Plague NFT"}
                      className="w-full md:w-48 h-48 object-cover rounded-lg border border-green-500/30 cursor-pointer hover:border-green-400 transition-colors"
                      crossOrigin="anonymous"
                      onClick={() => {
                        const imageUrl = nfts[currentIndex]?.image
                        if (imageUrl) {
                          const friendlyUrl = imageUrl.includes("ipfs://")
                            ? imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
                            : imageUrl
                          window.open(friendlyUrl, "_blank", "noopener,noreferrer")
                        }
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=256&width=256&text=Plague"
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <h5 className="text-green-400 font-semibold mb-2">Attributes</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {nfts[currentIndex]?.attributes?.map((attr, index) => (
                        <div key={index} className="bg-gray-700/50 p-2 rounded border border-gray-600">
                          <div className="text-gray-400 text-xs">{attr.trait_type}</div>
                          <div className="text-white text-sm font-medium">{attr.value}</div>
                        </div>
                      )) || <div className="text-gray-400 text-sm">No attributes available</div>}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {nfts.length > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      onClick={prevNFT}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      onClick={fetchNFTs}
                      disabled={loading}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh NFTs"
                    >
                      <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                    </button>

                    <button
                      onClick={nextNFT}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Specimen Carousel */}
              <div className="space-y-4 hidden">
                <div className="flex justify-between items-center">
                  <h5 className="text-green-400 font-semibold">Specimen Carousel</h5>
                  <div className="text-gray-400 text-sm">{nfts.length} specimens total</div>
                </div>

                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {nfts.map((nft, index) => (
                      <button
                        key={nft.mint}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          index === currentIndex
                            ? "border-green-400 ring-2 ring-green-400/50"
                            : "border-gray-600 hover:border-green-500"
                        }`}
                      >
                        <img
                          src={nft.image || "/placeholder.svg?height=64&width=64&text=Plague"}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=64&width=64&text=Plague"
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
