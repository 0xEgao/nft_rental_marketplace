"use client"

import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { TEST_NFT_ABI } from "@/lib/abis/test-nft"
import { TEST_NFT_ADDRESS } from "@/lib/constants"

export function MintTestNFT() {
  const { toast } = useToast()
  const [tokenURI, setTokenURI] = useState("https://example.com/nft/metadata")
  const [isMinting, setIsMinting] = useState(false)

  const { config } = usePrepareContractWrite({
    address: TEST_NFT_ADDRESS,
    abi: TEST_NFT_ABI,
    functionName: "mint",
    args: [undefined, tokenURI],
    enabled: tokenURI.length > 0,
  })

  const { write } = useContractWrite(config)

  const handleMint = async () => {
    if (!write) {
      toast({
        title: "Error",
        description: "Unable to prepare transaction",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMinting(true)
      write()
      toast({
        title: "Success",
        description: "NFT minting transaction submitted",
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

  return (
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
          <p className="text-xs text-muted-foreground">This should point to a JSON file with metadata for your NFT</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleMint} disabled={isMinting || !write} className="w-full">
          {isMinting ? "Minting..." : "Mint NFT"}
        </Button>
      </CardFooter>
    </Card>
  )
}
