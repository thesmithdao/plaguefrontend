import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: "Wallet address is required" }, { status: 400 })
    }

    const heliusApiKey = process.env.HELIUS_API_KEY
    if (!heliusApiKey) {
      return NextResponse.json({ success: false, error: "Helius API key not configured" }, { status: 500 })
    }

    const url = `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
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

    const allNfts = data.result?.items || []

    // Filter for PLAGUE NFTs
    const plagueNfts = allNfts.filter((nft: any) => {
      const collectionName = nft.grouping?.[0]?.group_value || ""
      const nftName = nft.content?.metadata?.name || ""

      return (
        collectionName.toLowerCase().includes("plague") ||
        nftName.toLowerCase().includes("plague") ||
        (nft.content?.metadata?.symbol && nft.content.metadata.symbol.toLowerCase().includes("plague"))
      )
    })

    const formattedNfts = plagueNfts.map((nft: any) => ({
      mint: nft.id,
      name: nft.content?.metadata?.name || "Unknown",
      image: nft.content?.files?.[0]?.uri || nft.content?.links?.image || "",
      description: nft.content?.metadata?.description || "",
      attributes: nft.content?.metadata?.attributes || [],
      collection: nft.grouping?.[0]?.group_value || null,
    }))

    return NextResponse.json({
      success: true,
      nfts: formattedNfts,
      total: formattedNfts.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch NFTs",
        nfts: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
