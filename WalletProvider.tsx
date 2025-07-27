"use client"

import type { FC, ReactNode } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import "@solana/wallet-adapter-react-ui/styles.css"

type Props = { children: ReactNode }

// Mainnet endpoint: use env var if provided, else Solana public RPC
const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl("mainnet-beta")

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  const wallets = [new PhantomWalletAdapter()]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={false}
        onError={() => {
          // Silent error handling - don't show any errors to users
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// Provide a default export so existing `import WalletProvider from ...` continues to work.
export default SolanaWalletProvider
