"use client"

import type React from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { createPublicClient, http } from "viem"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: [sepolia],
    }),
  ],
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
