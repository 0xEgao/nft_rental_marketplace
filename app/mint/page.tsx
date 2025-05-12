"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@/components/connect-button"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"

export default function MintPage() {
  const { toast } = useToast()
  const { account } = useWeb3()
  const [tokenURI, setTokenURI] = useState("https://example.com/nft/metadata")
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    if (!tokenURI) {
      toast({
        title: "Error",
        description: "Please enter a token URI",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMinting(true)
      // Mock minting for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT minted successfully",
      })
    } catch (error) {
      console.error("Minting error:", error)
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (!account) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to mint test NFTs</CardDescription>
          </CardHeader>
          <CardFooter>
            <ConnectButton className="w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mint Test NFTs</h1>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mint Test NFT</CardTitle>
            <CardDescription>Mint a test NFT to use in the rental marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="tokenURI">Token URI</Label>
              <Input
                id="tokenURI"
                placeholder="https://example.com/nft/metadata"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This should point to a JSON file with metadata for your NFT
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleMint} disabled={isMinting} className="w-full">
              {isMinting ? "Minting..." : "Mint NFT"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
