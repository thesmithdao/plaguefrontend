"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { Share2Icon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import WalletConnection from "@/components/WalletConnection" // Declare the WalletConnection component

interface NftData {
  mint: string
  name: string
  image: string
  attributes: { trait_type: string; value: string }[]
}

export default function Profile() {
  const { publicKey } = useWallet()
  const [nfts, setNfts] = useState<NftData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toast } = useToast()

  const fetchNfts = useCallback(async (walletAddress: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/get-nfts?walletAddress=${walletAddress}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setNfts(data.nfts)
      setCurrentIndex(0) // Reset to first NFT when new NFTs are loaded
    } catch (err) {
      console.error("Failed to fetch NFTs:", err)
      setError("Failed to load NFTs. Please try again later.")
      setNfts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (publicKey) {
      fetchNfts(publicKey.toBase58())
    } else {
      setNfts([])
      setLoading(false)
      setError(null)
    }
  }, [publicKey, fetchNfts])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % nfts.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length)
  }

  const handleShare = () => {
    if (nfts.length > 0 && nfts[currentIndex]) {
      const nft = nfts[currentIndex]
      const tweetText = `Check out my ${nft.name} NFT from Plague Labs! #PlagueLabs #NFT #Solana`
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(nft.image)}`
      window.open(tweetUrl, "_blank")
      toast({
        title: "Sharing NFT",
        description: "Opening Twitter to share your NFT!",
      })
    } else {
      toast({
        title: "No NFT to share",
        description: "Connect your wallet and load an NFT to share.",
        variant: "destructive",
      })
    }
  }

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please connect your Solana wallet to view your specimens.</p>
            <WalletConnection /> {/* Use the declared WalletConnection component */}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Loading Specimens...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="animate-pulse w-full h-64 bg-gray-800 rounded-lg" />
            <div className="w-full h-8 bg-gray-800 rounded-md" />
            <div className="w-full h-6 bg-gray-800 rounded-md" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse h-24 bg-gray-800 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={() => publicKey && fetchNfts(publicKey.toBase58())} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Specimens Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              It looks like you don't have any Plague Labs specimens in this wallet.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentNft = nfts[currentIndex]

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <Card className="w-full max-w-4xl bg-gray-800/50 border border-green-500/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-green-400">Specimen Gallery</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share NFT">
            <Share2Icon className="h-5 w-5 text-green-400 hover:text-green-300" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0 relative w-full md:w-64 h-64">
              <Image
                src={currentNft?.image || "/placeholder.svg?height=256&width=256&text=Plague"}
                alt={currentNft?.name || "Plague NFT"}
                layout="fill"
                objectFit="cover"
                className="rounded-lg border border-green-500/30 cursor-pointer hover:border-green-400 transition-colors"
                priority
              />
            </div>
            <div className="flex-grow space-y-4">
              <h2 className="text-3xl font-extrabold text-green-300">{currentNft?.name}</h2>
              <Separator className="bg-green-500/50" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-green-400">Specimen Attributes</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {currentNft?.attributes?.map((attr, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-300">{attr.trait_type}:</span>
                      <span className="font-medium text-green-200">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={nfts.length <= 1}
              className="rounded-full border-green-500 text-green-500 hover:bg-green-900 hover:text-white bg-transparent"
              aria-label="Previous NFT"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={nfts.length <= 1}
              className="rounded-full border-green-500 text-green-500 hover:bg-green-900 hover:text-white bg-transparent"
              aria-label="Next NFT"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Specimen Carousel - Restored */}
          <div className="space-y-4">
            {" "}
            {/* Removed 'hidden' class */}
            <h3 className="text-xl font-semibold text-green-400">All Specimens</h3>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {nfts.map((nft, index) => (
                  <CarouselItem key={nft.mint} className="pl-2 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                    <div className="p-1">
                      <Card
                        className={`cursor-pointer ${
                          index === currentIndex ? "border-green-400 ring-2 ring-green-400" : "border-gray-700"
                        } hover:border-green-500 transition-colors`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <CardContent className="flex aspect-square items-center justify-center p-2">
                          <Image
                            src={nft.image || "/placeholder.svg?height=100&width=100&text=NFT"}
                            alt={nft.name || "NFT Thumbnail"}
                            width={100}
                            height={100}
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 top-1/2 -translate-y-1/2" />
              <CarouselNext className="right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
