"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { ChevronLeft, ChevronRight, X, ExternalLink, Share2, RefreshCw, ShoppingCart } from "lucide-react"

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

  const getInfectionStatus = (count: number) => {
    if (count === 0) return { status: "Clean", color: "text-green-400", risk: "Low" }
    if (count <= 5) return { status: "Carrier", color: "text-yellow-400", risk: "Medium" }
    if (count <= 15) return { status: "Infected", color: "text-orange-400", risk: "High" }
    return { status: "Patient Zero", color: "text-red-400", risk: "Critical" }
  }

  const shareInfection = () => {
    const text = `I'm infected with ${nfts.length} PLAGUE specimens! 🦠 Check out my collection: ${window.location.href}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, "_blank")
  }

  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  const openMagicEden = () => {
    window.open("https://magiceden.io/marketplace/plagueproject", "_blank")
  }

  if (!publicKey) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💉</div>
            <p className="text-gray-300">Connect your wallet to see your Plague NFTs</p>
            <p className="text-gray-400 text-sm mt-2">No wallet connected</p>
          </div>
        </div>
      </div>
    )
  }

  const infectionData = getInfectionStatus(nfts.length)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              <p className="text-gray-300 mt-2">Analyzing specimens...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">⚠️</div>
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
              <div className="text-6xl mb-6">🦠</div>
              <h3 className="text-xl font-bold text-gray-300 mb-4">No PLAGUE specimens detected</h3>
              <p className="text-gray-400 mb-6">
                Patient appears to be uninfected. Acquire PLAGUE NFTs to unlock your infection profile!
              </p>
              <button
                onClick={openMagicEden}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Get PLAGUE NFTs on Magic Eden
              </button>
            </div>
          ) : (
            <>
              {/* Patient Info - Only show if user has NFTs */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-green-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">Infection Status</h3>
                    <p className={`text-lg font-bold ${infectionData.color}`}>{infectionData.status}</p>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">Contagion Risk</h3>
                    <p className={`text-lg font-bold ${infectionData.color}`}>{infectionData.risk}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={shareInfection}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Infection
                  </button>
                  <button
                    onClick={openMagicEden}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Get More
                  </button>
                </div>
              </div>

              {/* NFT Gallery */}
              <div className="space-y-4">
                <h3 className="text-green-400 font-semibold text-lg">Specimen Gallery</h3>

                {/* Current NFT Display */}
                <div className="relative bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
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
                        src={nfts[currentIndex]?.image || "/placeholder.svg?height=256&width=256&text=PLAGUE"}
                        alt={nfts[currentIndex]?.name}
                        className="w-full md:w-64 h-64 object-cover rounded-lg border border-green-500/30"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=256&width=256&text=PLAGUE"
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h5 className="text-green-400 font-semibold mb-2">Specimen Attributes</h5>
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
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={prevNFT}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="flex space-x-1">
                        {nfts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentIndex ? "bg-green-400" : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextNFT}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {nfts.map((nft, index) => (
                    <button
                      key={nft.mint}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? "border-green-400 ring-2 ring-green-400/50"
                          : "border-gray-600 hover:border-green-500"
                      }`}
                    >
                      <img
                        src={nft.image || "/placeholder.svg?height=100&width=100&text=PLAGUE"}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=100&width=100&text=PLAGUE"
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
