"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { X, Share2, ExternalLink } from "lucide-react"
import Image from "next/image"

interface NFT {
  name: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  external_url?: string
}

interface ProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function Profile({ isOpen, onClose }: ProfileProps) {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [currentNftIndex, setCurrentNftIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({})

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg"

    // Handle IPFS URLs
    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.slice(7)}`
    }

    // Handle Arweave URLs
    if (url.startsWith("ar://")) {
      return `https://arweave.net/${url.slice(5)}`
    }

    // Return as-is for HTTP/HTTPS URLs
    return url
  }

  useEffect(() => {
    if (isOpen && connected && publicKey) {
      fetchNFTs()
    }
  }, [isOpen, connected, publicKey])

  const fetchNFTs = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const response = await fetch(`/api/get-nfts?wallet=${publicKey.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setNfts(data.nfts || [])
        setCurrentNftIndex(0)
        // Initialize loading states
        const loadingStates: { [key: number]: boolean } = {}
        data.nfts?.forEach((_: any, index: number) => {
          loadingStates[index] = true
        })
        setImageLoading(loadingStates)
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => ({
      ...prev,
      [index]: false,
    }))
  }

  const handleImageError = (index: number) => {
    setImageLoading((prev) => ({
      ...prev,
      [index]: false,
    }))
  }

  const shareInfection = () => {
    if (navigator.share && nfts[currentNftIndex]) {
      navigator.share({
        title: `Check out my ${nfts[currentNftIndex].name}!`,
        text: `I own this amazing NFT: ${nfts[currentNftIndex].name}`,
        url: window.location.href,
      })
    } else {
      // Fallback to copying to clipboard
      const shareText = `Check out my ${nfts[currentNftIndex]?.name}! ${window.location.href}`
      navigator.clipboard.writeText(shareText)
      alert("Share link copied to clipboard!")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-green-400">Patient Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!connected ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Please connect your wallet to view your profile</div>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <div className="text-gray-400">Loading your specimens...</div>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No specimens found in your wallet</div>
              <div className="text-sm text-gray-500">Make sure you own Plague NFTs to see them here</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-green-400 font-semibold mb-1">Patient ID</div>
                  <div className="text-sm text-gray-300 font-mono">
                    {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold mb-1">Specimen Count</div>
                  <div className="text-2xl font-bold">{nfts.length}</div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={shareInfection}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Infection</span>
                  </button>
                </div>
              </div>

              {/* NFT Gallery */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-4">NFT Gallery</h3>

                {/* Current NFT Display */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">{nfts[currentNftIndex]?.name}</h4>
                    <div className="text-sm text-gray-400">
                      {currentNftIndex + 1} of {nfts.length}
                      {nfts[currentNftIndex]?.external_url && (
                        <a
                          href={nfts[currentNftIndex].external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-green-400 hover:text-green-300"
                        >
                          <ExternalLink className="h-4 w-4 inline" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NFT Image */}
                    <div className="relative">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                        {imageLoading[currentNftIndex] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                          </div>
                        )}
                        <Image
                          key={`${currentNftIndex}-${nfts[currentNftIndex]?.name}`}
                          src={getImageUrl(nfts[currentNftIndex]?.image) || "/placeholder.svg"}
                          alt={nfts[currentNftIndex]?.name || "NFT"}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            imageLoading[currentNftIndex] ? "opacity-0" : "opacity-100"
                          }`}
                          loading="eager"
                          onLoad={() => handleImageLoad(currentNftIndex)}
                          onError={() => handleImageError(currentNftIndex)}
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <h5 className="text-green-400 font-semibold mb-3">Attributes</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {nfts[currentNftIndex]?.attributes?.map((attr, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-3">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{attr.trait_type}</div>
                            <div className="text-sm font-semibold">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  {nfts.length > 1 && (
                    <div className="flex justify-center space-x-4 mt-6">
                      <button
                        onClick={() => setCurrentNftIndex(Math.max(0, currentNftIndex - 1))}
                        disabled={currentNftIndex === 0}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentNftIndex(Math.min(nfts.length - 1, currentNftIndex + 1))}
                        disabled={currentNftIndex === nfts.length - 1}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
