"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { X, Share2, ExternalLink, Loader2 } from "lucide-react"
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

export default function Profile({ onClose }: { onClose: () => void }) {
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

      // Filter for Plague NFTs and preload images
      const plagueNFTs = data.nfts.filter((nft: any) => nft.name && nft.name.toLowerCase().includes("plague"))

      // Set initial loading state for all images
      const loadingState: { [key: string]: boolean } = {}
      plagueNFTs.forEach((nft: NFT) => {
        loadingState[nft.id] = true
      })
      setImageLoading(loadingState)

      setNfts(plagueNFTs)
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
    if (imageUrl.includes("arweave.net")) {
      return imageUrl
    }

    // Handle other URLs
    return imageUrl
  }

  const handleImageLoad = (nftId: string) => {
    setImageLoading((prev) => ({
      ...prev,
      [nftId]: false,
    }))
  }

  const handleImageError = (nftId: string) => {
    setImageLoading((prev) => ({
      ...prev,
      [nftId]: false,
    }))
  }

  const handleShare = async () => {
    const shareText = `Check out my Plague NFT collection! Patient ID: ${publicKey?.toString().slice(0, 8)}...${publicKey?.toString().slice(-8)}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Plague NFT Collection",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
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
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              </div>
              <h3 className="text-white font-semibold mb-2">Wallet Not Connected</h3>
              <p className="text-gray-400 text-sm mb-6">Connect your wallet to view your Plague NFT collection</p>
            </div>
            <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !text-white !font-bold !px-6 !py-3 !rounded-lg !border-2 !border-green-500 hover:!border-green-400 !transition-all !w-full" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-1">Patient ID</h3>
              <p className="text-white text-sm font-mono">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-1">Specimen Count</h3>
              <p className="text-white text-2xl font-bold">{nfts.length}</p>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Share2 className="h-4 w-4" />
                Share Infection
              </button>
            </div>
          </div>

          {/* NFT Gallery */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-green-400 font-bold text-xl mb-4">NFT Gallery</h3>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                <span className="ml-2 text-gray-400">Loading specimens...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchNFTs}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && nfts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-600 rounded"></div>
                </div>
                <p className="text-gray-400">No Plague NFTs found in this wallet</p>
              </div>
            )}

            {!loading && !error && nfts.length > 0 && (
              <div className="space-y-6">
                {nfts.map((nft, index) => (
                  <div key={`${nft.id}-${index}`} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">{nft.name}</h4>
                      <span className="text-gray-400 text-sm">
                        {index + 1} of {nfts.length}
                      </span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* NFT Image */}
                      <div className="relative">
                        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                          {imageLoading[nft.id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
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
                            loading="eager"
                            onLoad={() => handleImageLoad(nft.id)}
                            onError={() => handleImageError(nft.id)}
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>

                      {/* Attributes */}
                      <div>
                        <h5 className="text-green-400 font-semibold mb-3">Attributes</h5>
                        <div className="grid grid-cols-1 gap-3">
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
