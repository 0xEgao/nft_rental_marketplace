"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the type for the ethereum object in the window
declare global {
  interface Window {
    ethereum?: any
  }
}

type Web3ContextType = {
  account: string | null
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
})

export function useWeb3() {
  return useContext(Web3Context)
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && window.ethereum

  // Initialize connection
  useEffect(() => {
    if (isMetaMaskInstalled) {
      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((chainId: string) => setChainId(Number.parseInt(chainId, 16)))
          }
        })
        .catch(console.error)

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      }

      // Listen for chain changes
      const handleChainChanged = (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [isMetaMaskInstalled])

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled) {
      alert("Please install MetaMask to use this application")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(Number.parseInt(chainId, 16))
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null)
  }

  const value = {
    account,
    chainId,
    connect,
    disconnect,
    isConnecting,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
