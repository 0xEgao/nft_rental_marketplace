"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, ChevronDown } from "lucide-react"
import { useWeb3 } from "./web3-provider"

interface ConnectButtonProps {
  className?: string
}

export function ConnectButton({ className }: ConnectButtonProps) {
  const { account, connect, disconnect, isConnecting } = useWeb3()
  const [isOpen, setIsOpen] = useState(false)

  if (account) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={className}>
            {shortenAddress(account)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(account)
              setIsOpen(false)
            }}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              disconnect()
              setIsOpen(false)
            }}
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} disabled={isConnecting} className={className}>
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
