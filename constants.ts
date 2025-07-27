// PLAGUE Labs Configuration
export const PLAGUE_CONFIG = {
  // Collection Information
  COLLECTION_NAME: "PLAGUE",
  COLLECTION_DESCRIPTION: "A web3 marketing agency focused on memetic languages",

  // Social Links
  TWITTER_URL: "https://twitter.com/plague_labs",
  DISCORD_URL: "https://discord.gg/plague",
  WEBSITE_URL: "https://plague-labs.com",

  // API Configuration
  HELIUS_RPC_URL: "https://mainnet.helius-rpc.com",

  // UI Configuration
  THEME: {
    PRIMARY_COLOR: "#10b981", // Green
    SECONDARY_COLOR: "#059669",
    ACCENT_COLOR: "#047857",
    BACKGROUND_COLOR: "#000000",
    TEXT_COLOR: "#ffffff",
  },

  // NFT Collection Settings
  NFT_SETTINGS: {
    VERIFIED_CREATOR: "PLAGUEhKiPBcNLKqWgVVhQJVkwbXbWyXUWcp8Jc6KqE",
    COLLECTION_SIZE: 10000,
    MINT_PRICE: 0.1, // SOL
  },
}

// Export individual constants for backward compatibility
export const COLLECTION_NAME = PLAGUE_CONFIG.COLLECTION_NAME
export const TWITTER_URL = PLAGUE_CONFIG.TWITTER_URL
export const DISCORD_URL = PLAGUE_CONFIG.DISCORD_URL
