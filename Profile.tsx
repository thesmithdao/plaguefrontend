"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { X, ExternalLink, Share2 } from "lucide-react"
import Image from "next/image"

interface NFT {
  name: string
  image: string
  mint: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

export default function Profile({ onClose }: { onClose: () => void }) {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})

  const fetchNFTs = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const response = await fetch(`/api/get-nfts?wallet=${publicKey.toString()}`)
      const data = await response.json()

      if (data.success) {
        const plagueNFTs = data.nfts.filter((nft: NFT) => nft.name && nft.name.toLowerCase().includes("plague"))
        setNfts(plagueNFTs)

        // Initialize loading states for all images
        const loadingStates: { [key: string]: boolean } = {}
        plagueNFTs.forEach((nft: NFT) => {
          loadingStates[nft.mint] = true
        })
        setImageLoading(loadingStates)
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    }
  }, [connected, publicKey])

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg?height=400&width=400"

    // Handle IPFS URLs
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/")
    }

    // Handle Arweave URLs
    if (url.includes("arweave.net")) {
      return url
    }

    // Handle other URLs
    return url
  }

  const handleImageLoad = (mint: string) => {
    setImageLoading((prev) => ({
      ...prev,
      [mint]: false,
    }))
  }

  const handleImageError = (mint: string) => {
    setImageLoading((prev) => ({
      ...prev,
      [mint]: false,
    }))
  }

  const handleShare = async () => {
    const currentNFT = nfts[currentIndex]
    if (!currentNFT) return

    const shareText = `Check out my ${currentNFT.name} NFT! 🧪 #PlagueLabs #NFT #Solana`

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentNFT.name,
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
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
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Wallet Not Connected</h3>
              <p className="text-gray-400 text-sm mb-6">
                Connect your wallet to view your Plague NFT collection and patient data.
              </p>
            </div>
            <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !text-white !font-bold !px-6 !py-3 !rounded-lg !border-2 !border-green-500 hover:!border-green-400 !transition-all !shadow-lg !w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Analyzing specimens...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🦠</span>
              </div>
              <h3 className="text-white font-semibold mb-2">No Plague Specimens Found</h3>
              <p className="text-gray-400">
                No Plague NFTs detected in your wallet. Visit our collection to acquire specimens.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-green-400 font-semibold mb-1">Patient ID</h3>
                  <p className="text-white font-mono text-sm">
                    {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                  </p>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-1">Specimen Count</h3>
                  <p className="text-white text-2xl font-bold">{nfts.length}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleShare}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Infection
                  </button>
                </div>
              </div>

              {/* NFT Gallery */}
              <div>
                <h3 className="text-green-400 font-semibold mb-4">NFT Gallery</h3>

                {nfts.map((nft, index) => (
                  <div key={nft.mint} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">{nft.name}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>
                          {index + 1} of {nfts.length}
                        </span>
                        <a
                          href={`https://solscan.io/token/${nft.mint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* NFT Image */}
                      <div className="relative">
                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                          {imageLoading[nft.mint] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                            </div>
                          )}
                          <Image
                            key={`${nft.mint}-${index}`}
                            src={getImageUrl(nft.image) || "/placeholder.svg"}
                            alt={nft.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              imageLoading[nft.mint] ? "opacity-0" : "opacity-100"
                            }`}
                            loading="eager"
                            onLoad={() => handleImageLoad(nft.mint)}
                            onError={() => handleImageError(nft.mint)}
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>

                      {/* Attributes */}
                      <div>
                        <h5 className="text-green-400 font-semibold mb-3">Attributes</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {nft.attributes?.map((attr, attrIndex) => (
                            <div key={attrIndex} className="bg-gray-800 rounded-lg p-3">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
