import { type NextRequest, NextResponse } from "next/server"

const HELIUS_API_KEY = process.env.HELIUS_API_KEY
const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    if (!HELIUS_API_KEY) {
      return NextResponse.json({ error: "Helius API key not configured" }, { status: 500 })
    }

    const response = await fetch(HELIUS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "get-nfts",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: false,
            showNativeBalance: false,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Helius API error: ${data.error.message}`)
    }

    const assets = data.result?.items || []

    // Filter for PLAGUE NFTs
    const plagueNfts = assets.filter((asset: any) => {
      const name = asset.content?.metadata?.name || ""
      const symbol = asset.content?.metadata?.symbol || ""
      const collection = asset.grouping?.find((g: any) => g.group_key === "collection")

      return (
        name.toLowerCase().includes("plague") ||
        symbol.toLowerCase().includes("plague") ||
        collection?.group_value === "BKJbNznXgNRc5KkJ2E5EZm5fkzJvJTXJWu9xpGY9CQGJ" // PLAGUE collection address
      )
    })

    const formattedNfts = plagueNfts.map((asset: any) => ({
      mint: asset.id,
      name: asset.content?.metadata?.name || "Unknown",
      image: asset.content?.files?.[0]?.uri || asset.content?.links?.image || "",
      description: asset.content?.metadata?.description || "",
      attributes: asset.content?.metadata?.attributes || [],
      collection: asset.grouping?.find((g: any) => g.group_key === "collection")?.group_value || null,
    }))

    return NextResponse.json({
      success: true,
      nfts: formattedNfts,
      total: formattedNfts.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch NFTs",
        nfts: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
