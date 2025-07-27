import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const heliusApiKey = process.env.HELIUS_API_KEY
    if (!heliusApiKey) {
      return NextResponse.json({ error: "Helius API key not configured" }, { status: 500 })
    }

    const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/nfts?api-key=${heliusApiKey}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter for PLAGUE NFTs
    const plagueNfts = data.filter((nft: any) => {
      const collectionName = nft?.grouping?.find((g: any) => g.group_key === "collection")?.group_value
      return collectionName === "DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4x"
    })

    // Transform the data to match our interface
    const transformedNfts = plagueNfts.map((nft: any) => ({
      name: nft.content?.metadata?.name || "Unknown",
      image: nft.content?.files?.[0]?.uri || nft.content?.metadata?.image || "",
      mint: nft.id,
      attributes: nft.content?.metadata?.attributes || [],
    }))

    return NextResponse.json({
      success: true,
      nfts: transformedNfts,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        nfts: [],
      },
      { status: 500 },
    )
  }
}
