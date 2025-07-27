import { type NextRequest, NextResponse } from "next/server"

// Update collection configuration for PLAGUE
const COLLECTION_CONFIG = {
  // PLAGUE collection verified creator address
  VERIFIED_CREATOR: "PLAGUEhKiPBcNLKqWgVVhQJVkwbXbWyXUWcp8Jc6KqE",
  // This is the actual PLAGUE collection creator address
  COLLECTION_ADDRESS: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const walletAddress = searchParams.get("walletAddress")

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  try {
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY
    if (!HELIUS_API_KEY) {
      return NextResponse.json(
        {
          error: "API configuration missing - please check environment variables",
          nfts: [],
          total: 0,
          success: false,
        },
        { status: 500 },
      )
    }

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "get-assets-by-owner",
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
      throw new Error(`Helius API failed with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Helius API error: ${data.error.message}`)
    }

    const allAssets = data.result?.items || []

    // Filter for PLAGUE collection NFTs using multiple verification methods
    const collectionNfts = allAssets.filter((asset: any) => {
      // Check if it's an NFT
      const isNFT =
        asset.interface === "V1_NFT" || asset.interface === "ProgrammableNFT" || asset.interface === "MplCoreAsset"

      if (!isNFT) return false

      // Check for valid content
      const hasValidContent =
        asset.content?.metadata?.name && (asset.content?.files?.length > 0 || asset.content?.links?.image)
      if (!hasValidContent) return false

      // Primary check: verified creator address
      const hasVerifiedCreator = asset.creators?.some(
        (creator: any) => creator.verified && creator.address === COLLECTION_CONFIG.VERIFIED_CREATOR,
      )

      // Secondary check: collection name or symbol contains "PLAGUE"
      const isPlague =
        asset.content?.metadata?.name?.toUpperCase().includes("PLAGUE") ||
        asset.content?.metadata?.symbol?.toUpperCase().includes("PLAGUE") ||
        asset.grouping?.some((group: any) => group.group_key === "collection" && group.group_value?.includes("PLAGUE"))

      // Tertiary check: authority or update authority matches known PLAGUE addresses
      const hasPlaugeAuthority =
        asset.authorities?.some((auth: any) => auth.address === COLLECTION_CONFIG.VERIFIED_CREATOR) ||
        asset.compression?.creator_hash?.includes(COLLECTION_CONFIG.VERIFIED_CREATOR)

      return hasVerifiedCreator || (isPlague && (hasPlaugeAuthority || asset.creators?.length > 0))
    })

    // Format the NFTs for the frontend
    const formattedNfts = collectionNfts.map((nft: any) => {
      let imageUrl = "/placeholder.svg"

      // Try multiple sources for image URL
      if (nft.content?.files?.length > 0) {
        const imageFile = nft.content.files.find(
          (file: any) => file.mime?.startsWith("image/") || file.cdn_uri || file.uri,
        )
        if (imageFile) {
          imageUrl = imageFile.cdn_uri || imageFile.uri || "/placeholder.svg"
        }
      } else if (nft.content?.links?.image) {
        imageUrl = nft.content.links.image
      } else if (nft.content?.json_uri) {
        // Fallback to json_uri if available
        imageUrl = nft.content.json_uri
      }

      return {
        mint: nft.id,
        name: nft.content?.metadata?.name || "PLAGUE Specimen",
        image: imageUrl,
        description: nft.content?.metadata?.description || "",
        attributes: nft.content?.metadata?.attributes || [],
        collection: nft.grouping?.find((g: any) => g.group_key === "collection")?.group_value || null,
      }
    })

    // Sort by NFT number for consistent ordering
    formattedNfts.sort((a, b) => {
      const getNumber = (name: string) => {
        const match = name.match(/#(\d+)/)
        return match ? Number.parseInt(match[1]) : 0
      }
      return getNumber(a.name) - getNumber(b.name)
    })

    return NextResponse.json({
      nfts: formattedNfts,
      total: formattedNfts.length,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch NFTs",
        nfts: [],
        total: 0,
        success: false,
      },
      { status: 500 },
    )
  }
}
