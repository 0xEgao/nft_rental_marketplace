"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@/components/connect-button"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { useRentalMarketplace } from "@/hooks/use-rental-marketplace"

export default function NFTDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { account } = useWeb3()
  const { getListing } = useRentalMarketplace()

  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rentDuration, setRentDuration] = useState("")
  const [isRenting, setIsRenting] = useState(false)
  const [isReclaiming, setIsReclaiming] = useState(false)
  const [isDelisting, setIsDelisting] = useState(false)

  const listingId = params.listingId as string

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(BigInt(listingId))
        setListing(data)
      } catch (error) {
        console.error("Error fetching listing:", error)
        toast({
          title: "Error",
          description: "Failed to fetch NFT details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    }
  }, [listingId, getListing, toast])

  const handleRent = async () => {
    if (!rentDuration) {
      toast({
        title: "Error",
        description: "Please enter a rental duration",
        variant: "destructive",
      })
      return
    }

    try {
      setIsRenting(true)
      // Mock rental for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT rented successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Rental error:", error)
      toast({
        title: "Error",
        description: "Failed to rent NFT",
        variant: "destructive",
      })
    } finally {
      setIsRenting(false)
    }
  }

  const handleReclaim = async () => {
    try {
      setIsReclaiming(true)
      // Mock reclaim for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT reclaimed successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Reclaim error:", error)
      toast({
        title: "Error",
        description: "Failed to reclaim NFT",
        variant: "destructive",
      })
    } finally {
      setIsReclaiming(false)
    }
  }

  const handleDelist = async () => {
    try {
      setIsDelisting(true)
      // Mock delist for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "NFT delisted successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Delist error:", error)
      toast({
        title: "Error",
        description: "Failed to delist NFT",
        variant: "destructive",
      })
    } finally {
      setIsDelisting(false)
    }
  }

  if (!account) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to view NFT details</CardDescription>
          </CardHeader>
          <CardFooter>
            <ConnectButton className="w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>NFT Not Found</CardTitle>
            <CardDescription>The requested NFT listing does not exist</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Marketplace
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const isOwner = account?.toLowerCase() === listing.lister.toLowerCase()
  const isRented = listing.status === 1 // Assuming 1 is the "Rented" status
  const isAvailable = listing.status === 0 // Assuming 0 is the "Available" status
  const canReclaim = isOwner && isRented && new Date(Number(listing.rentalEndTime) * 1000) < new Date()

  const formatEther = (value: bigint) => {
    // Simple formatEther implementation
    return (Number(value) / 1e18).toString()
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>NFT Details</CardTitle>
          <CardDescription>
            {isAvailable ? "Available for rent" : isRented ? "Currently rented" : "Not available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <img
              src={`/placeholder.svg?height=400&width=400&text=NFT%20${listing.tokenId}`}
              alt={`NFT ${listing.tokenId}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Contract Address</h3>
              <p className="text-sm text-muted-foreground break-all">{listing.nftContract}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Token ID</h3>
              <p className="text-sm text-muted-foreground">{listing.tokenId.toString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Price Per Day</h3>
              <p className="text-sm text-muted-foreground">{formatEther(listing.pricePerDay)} ETH</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Max Duration</h3>
              <p className="text-sm text-muted-foreground">{listing.maxDuration.toString()} days</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Owner</h3>
              <p className="text-sm text-muted-foreground break-all">{listing.lister}</p>
            </div>
            {isRented && (
              <>
                <div>
                  <h3 className="text-sm font-medium">Rented By</h3>
                  <p className="text-sm text-muted-foreground break-all">{listing.renter}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Rental End Time</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Number(listing.rentalEndTime) * 1000).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>

          {isAvailable && !isOwner && (
            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Rental Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max={listing.maxDuration.toString()}
                  placeholder={`1-${listing.maxDuration.toString()} days`}
                  value={rentDuration}
                  onChange={(e) => setRentDuration(e.target.value)}
                />
              </div>
              <Button onClick={handleRent} disabled={isRenting} className="w-full">
                {isRenting
                  ? "Processing..."
                  : `Rent NFT (${rentDuration ? (Number.parseFloat(formatEther(listing.pricePerDay)) * Number.parseInt(rentDuration)).toFixed(4) : "0.0000"} ETH)`}
              </Button>
            </div>
          )}

          {isOwner && isAvailable && (
            <Button onClick={handleDelist} disabled={isDelisting} variant="destructive" className="w-full mt-4">
              {isDelisting ? "Processing..." : "Delist NFT"}
            </Button>
          )}

          {canReclaim && (
            <Button onClick={handleReclaim} disabled={isReclaiming} className="w-full mt-4">
              {isReclaiming ? "Processing..." : "Reclaim NFT"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
