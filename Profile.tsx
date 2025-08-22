"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { X, ExternalLink, Share2, RefreshCw } from "lucide-react"
import Image from "next/image"

interface NFT {
  id: string
  mint: string
  name: string
  image: string
  description?: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  external_url?: string
  collection?: string
}

interface ProfileProps {
  onClose: () => void
}

export default function Profile({ onClose }: ProfileProps) {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})

  const fetchNFTs = async () => {
    if (!publicKey) return

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching NFTs for wallet:", publicKey.toString())

      const response = await fetch(`/api/get-nfts?walletAddress=${publicKey.toString()}`)
      const data = await response.json()

      console.log("API Response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch NFTs")
      }

      if (data.success) {
        setNfts(data.nfts || [])
        console.log("Found NFTs:", data.nfts?.length || 0)
      } else {
        throw new Error(data.error || "API returned unsuccessful response")
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err)
      setError(err instanceof Error ? err.message : "Failed to load NFTs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    }
  }, [connected, publicKey])

  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "/placeholder.svg"

    // Handle IPFS URLs
    if (imageUrl.startsWith("ipfs://")) {
      return imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
    }

    // Handle Arweave URLs
    if (imageUrl.startsWith("ar://")) {
      return imageUrl.replace("ar://", "https://arweave.net/")
    }

    // Handle gateway.pinata.cloud URLs
    if (imageUrl.includes("gateway.pinata.cloud")) {
      return imageUrl
    }

    // Handle other IPFS gateways
    if (imageUrl.includes("/ipfs/")) {
      return imageUrl
    }

    // Return as-is for HTTP/HTTPS URLs
    return imageUrl
  }

  const handleImageLoad = (nftId: string) => {
    setImageLoading((prev) => ({ ...prev, [nftId]: false }))
  }

  const handleImageError = (nftId: string) => {
    console.log("Image failed to load for NFT:", nftId)
    setImageLoading((prev) => ({ ...prev, [nftId]: false }))
  }

  const handleImageLoadStart = (nftId: string) => {
    setImageLoading((prev) => ({ ...prev, [nftId]: true }))
  }

  const handleShare = async () => {
    if (!publicKey) return

    const shareText = `Check out my Plague Labs profile! Patient ID: ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)} - ${nfts.length} specimens collected! 🧪`

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Plague Labs Profile",
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        // You could add a toast notification here
      }
    } catch (err) {
      console.log("Share failed:", err)
    }
  }

  if (!connected) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <X className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-white font-semibold mb-2">Wallet Not Connected</h3>
              <p className="text-gray-400 text-sm">
                Please connect your wallet to view your patient profile and NFT specimens.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNFTs}
              disabled={loading}
              className="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              title="Refresh NFTs"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-1">Patient ID</h3>
              <p className="text-white text-sm font-mono">
                {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : ""}
              </p>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-1">Specimen Count</h3>
              <p className="text-white text-2xl font-bold">{nfts.length}</p>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share Infection
              </button>
            </div>
          </div>

          {/* NFT Gallery */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-green-400 font-semibold mb-4">NFT Gallery</h3>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                <span className="ml-3 text-gray-400">Analyzing specimens...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <X className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchNFTs}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Analysis
                </button>
              </div>
            )}

            {!loading && !error && nfts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🧪</span>
                </div>
                <h4 className="text-white font-semibold mb-2">No Specimens Detected</h4>
                <p className="text-gray-400 mb-4">No Plague NFTs found in this wallet.</p>
                <a
                  href="https://magiceden.io/marketplace/plagueproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 inline-flex items-center gap-1 text-sm"
                >
                  Browse Collection <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {!loading && !error && nfts.length > 0 && (
              <div className="space-y-6">
                {nfts.map((nft, index) => (
                  <div key={`${nft.id}-${index}`} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white font-semibold">{nft.name}</h4>
                        <p className="text-gray-400 text-sm">
                          Specimen {index + 1} of {nfts.length}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://solscan.io/token/${nft.mint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="View on Solscan"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* NFT Image */}
                      <div className="relative">
                        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                          {imageLoading[nft.id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                            </div>
                          )}
                          <Image
                            key={`${nft.id}-${nft.image}`}
                            src={getImageUrl(nft.image) || "/placeholder.svg"}
                            alt={nft.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              imageLoading[nft.id] ? "opacity-0" : "opacity-100"
                            }`}
                            onLoadStart={() => handleImageLoadStart(nft.id)}
                            onLoad={() => handleImageLoad(nft.id)}
                            onError={() => handleImageError(nft.id)}
                            loading="eager"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>

                      {/* Attributes */}
                      <div className="md:col-span-2">
                        <h5 className="text-green-400 font-semibold mb-3">Specimen Analysis</h5>
                        {nft.attributes && nft.attributes.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {nft.attributes.map((attr, attrIndex) => (
                              <div key={attrIndex} className="bg-gray-700/50 rounded-lg p-3">
                                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                                  {attr.trait_type}
                                </div>
                                <div className="text-white font-medium">{attr.value}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <div className="text-gray-400 text-sm">No attributes available for this specimen</div>
                          </div>
                        )}

                        {nft.description && (
                          <div className="mt-3 bg-gray-700/30 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Description</div>
                            <div className="text-white text-sm">{nft.description}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
