"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@/components/connect-button"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"

export default function ListNFTPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { account, isConnecting } = useWeb3()

  const [nftContractAddress, setNftContractAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [pricePerDay, setPricePerDay] = useState("")
  const [maxDuration, setMaxDuration] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isListing, setIsListing] = useState(false)

  const handleApprove = async () => {
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Please enter a valid token ID",
        variant: "destructive",
      })
      return
    }

    try {
      setIsApproving(true)
      // Mock approval for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT approved for marketplace",
      })
    } catch (error) {
      console.error("Approval error:", error)
      toast({
        title: "Error",
        description: "Failed to approve NFT",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleList = async () => {
    if (!nftContractAddress || !tokenId || !pricePerDay || !maxDuration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsListing(true)
      // Mock listing for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT listed successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Listing error:", error)
      toast({
        title: "Error",
        description: "Failed to list NFT",
        variant: "destructive",
      })
    } finally {
      setIsListing(false)
    }
  }

  if (!account) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to list an NFT</CardDescription>
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>List Your NFT for Rent</CardTitle>
          <CardDescription>Fill in the details below to list your NFT on the rental marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nftContract">NFT Contract Address</Label>
            <Input
              id="nftContract"
              placeholder="0x..."
              value={nftContractAddress}
              onChange={(e) => setNftContractAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokenId">Token ID</Label>
            <Input id="tokenId" placeholder="1" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price Per Day (ETH)</Label>
            <Input
              id="pricePerDay"
              placeholder="0.01"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDuration">Maximum Rental Duration (Days)</Label>
            <Input
              id="maxDuration"
              placeholder="7"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Button onClick={handleApprove} disabled={isApproving} className="w-full mb-2" variant="outline">
              {isApproving ? "Approving..." : "1. Approve NFT for Marketplace"}
            </Button>
            <Button onClick={handleList} disabled={isListing} className="w-full">
              {isListing ? "Listing..." : "2. List NFT for Rent"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
