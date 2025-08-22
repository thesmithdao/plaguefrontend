"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { X, Share2, ExternalLink } from "lucide-react"
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

interface ProfileProps {
  onClose: () => void
}

export default function Profile({ onClose }: ProfileProps) {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})
  const [currentNftIndex, setCurrentNftIndex] = useState(0)

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    }
  }, [connected, publicKey])

  const fetchNFTs = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const response = await fetch(`/api/get-nfts?wallet=${publicKey.toString()}`)
      const data = await response.json()

      if (data.success) {
        const plagueNFTs = data.nfts.filter((nft: NFT) => nft.name?.toLowerCase().includes("plague"))
        setNfts(plagueNFTs)
        if (plagueNFTs.length > 0) {
          setCurrentNftIndex(0)
        }
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imageUrl: string) => {
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

  const handleImageLoad = (mint: string) => {
    setImageLoading((prev) => ({ ...prev, [mint]: false }))
  }

  const handleImageError = (mint: string) => {
    setImageLoading((prev) => ({ ...prev, [mint]: false }))
  }

  const handleShare = () => {
    const shareText = `Check out my Plague NFT collection! 🧪 #PlagueNFT #Solana`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(shareUrl, "_blank")
  }

  const currentNft = nfts[currentNftIndex]

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
            <p className="text-gray-300 mb-4">Connect your wallet to view your patient profile and NFT specimens.</p>
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Analyzing specimens...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No Plague specimens detected in your collection.</p>
              <a
                href="https://magiceden.io/marketplace/plagueproject"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline inline-flex items-center gap-1"
              >
                Browse Collection <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div>
              <h3 className="text-green-400 font-semibold mb-4">NFT Gallery</h3>

              {/* Current NFT Display */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold text-lg">{currentNft.name}</h4>
                  <span className="text-gray-400 text-sm">
                    {currentNftIndex + 1} of {nfts.length}
                    <a
                      href={`https://solscan.io/token/${currentNft.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-green-400 hover:text-green-300"
                    >
                      <ExternalLink className="h-4 w-4 inline" />
                    </a>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* NFT Image */}
                  <div className="relative">
                    <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                      {imageLoading[currentNft.mint] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                        </div>
                      )}
                      <Image
                        key={`${currentNft.mint}-${currentNftIndex}`}
                        src={getImageUrl(currentNft.image) || "/placeholder.svg"}
                        alt={currentNft.name}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          imageLoading[currentNft.mint] ? "opacity-0" : "opacity-100"
                        }`}
                        loading="eager"
                        onLoad={() => handleImageLoad(currentNft.mint)}
                        onError={() => handleImageError(currentNft.mint)}
                        onLoadStart={() => setImageLoading((prev) => ({ ...prev, [currentNft.mint]: true }))}
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <h5 className="text-green-400 font-semibold mb-3">Attributes</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentNft.attributes?.map((attr, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">{attr.trait_type}</div>
                          <div className="text-white font-medium">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {nfts.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentNftIndex((prev) => (prev > 0 ? prev - 1 : nfts.length - 1))}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentNftIndex((prev) => (prev < nfts.length - 1 ? prev + 1 : 0))}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
