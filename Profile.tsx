"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { X, ExternalLink, Share2 } from "lucide-react"
import Image from "next/image"

interface NFT {
  id: string
  name: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  external_url?: string
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
      const response = await fetch(`/api/get-nfts?wallet=${publicKey.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch NFTs")
      }

      setNfts(data.nfts || [])
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
    if (!imageUrl) return "/placeholder.jpg"

    // Handle IPFS URLs
    if (imageUrl.startsWith("ipfs://")) {
      return imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
    }

    // Handle Arweave URLs
    if (imageUrl.startsWith("ar://")) {
      return imageUrl.replace("ar://", "https://arweave.net/")
    }

    // Return as-is for HTTP/HTTPS URLs
    return imageUrl
  }

  const handleImageLoad = (nftId: string) => {
    setImageLoading((prev) => ({ ...prev, [nftId]: false }))
  }

  const handleImageError = (nftId: string) => {
    setImageLoading((prev) => ({ ...prev, [nftId]: false }))
  }

  const handleImageLoadStart = (nftId: string) => {
    setImageLoading((prev) => ({ ...prev, [nftId]: true }))
  }

  const handleShare = async () => {
    if (!publicKey) return

    const shareText = `Check out my Plague Labs profile! Patient ID: ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
    const shareUrl = `${window.location.origin}?wallet=${publicKey.toString()}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Plague Labs Profile",
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
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
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
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
                <span className="ml-3 text-gray-400">Loading specimens...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchNFTs}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && nfts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <X className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-400">No specimens found in this wallet.</p>
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
                          {index + 1} of {nfts.length}
                        </p>
                      </div>
                      {nft.external_url && (
                        <a
                          href={nft.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
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
                        <h5 className="text-green-400 font-semibold mb-3">Attributes</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {nft.attributes?.map((attr, attrIndex) => (
                            <div key={attrIndex} className="bg-gray-700/50 rounded-lg p-3">
                              <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                                {attr.trait_type}
                              </div>
                              <div className="text-white font-medium">{attr.value}</div>
                            </div>
                          ))}
                        </div>
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
