"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRentalMarketplace } from "@/hooks/use-rental-marketplace"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

export function NFTListings() {
  const router = useRouter()
  const { getAvailableListings } = useRentalMarketplace()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAvailableListings()
        setListings(data)
      } catch (error) {
        console.error("Error fetching listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [getAvailableListings])

  const formatEther = (value: bigint) => {
    // Simple formatEther implementation
    return (Number(value) / 1e18).toString()
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available NFTs</h2>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/mint")} variant="outline">
              Mint Test NFT
            </Button>
            <Button onClick={() => router.push("/list")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              List NFT
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available NFTs</h2>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/mint")} variant="outline">
            Mint Test NFT
          </Button>
          <Button onClick={() => router.push("/list")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            List NFT
          </Button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No NFTs available for rent</h3>
          <p className="text-muted-foreground mt-2">Be the first to list your NFT for rent!</p>
          <Button onClick={() => router.push("/list")} className="mt-4">
            List an NFT
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id.toString()} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=NFT%20${listing.tokenId}`}
                    alt={`NFT ${listing.tokenId}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg">NFT #{listing.tokenId.toString()}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{formatEther(listing.pricePerDay)} ETH per day</p>
                <p className="text-sm text-muted-foreground">Max duration: {listing.maxDuration.toString()} days</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => router.push(`/nft/${listing.id}`)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
