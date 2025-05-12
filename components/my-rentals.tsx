"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRentalMarketplace } from "@/hooks/use-rental-marketplace"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"

export function MyRentals() {
  const router = useRouter()
  const { account } = useWeb3()
  const { getUserRentals } = useRentalMarketplace()
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRentals = async () => {
      if (!account) {
        setLoading(false)
        return
      }

      try {
        const data = await getUserRentals(account)
        setRentals(data)
      } catch (error) {
        console.error("Error fetching user rentals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [getUserRentals, account])

  const formatEther = (value: bigint) => {
    // Simple formatEther implementation
    return (Number(value) / 1e18).toString()
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Connect your wallet</h3>
        <p className="text-muted-foreground mt-2">Please connect your wallet to view your rentals</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">My Rentals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">My Rentals</h2>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No NFTs rented</h3>
          <p className="text-muted-foreground mt-2">You haven't rented any NFTs yet</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Browse NFTs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => {
            const now = new Date()
            const endTime = new Date(Number(rental.rentalEndTime) * 1000)
            const isActive = now < endTime

            return (
              <Card key={rental.id.toString()} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=200&width=300&text=NFT%20${rental.tokenId}`}
                      alt={`NFT ${rental.tokenId}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">NFT #{rental.tokenId.toString()}</CardTitle>
                    <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Expired"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatEther(rental.pricePerDay)} ETH per day</p>
                  <p className="text-sm text-muted-foreground mt-2">Rental ends: {endTime.toLocaleString()}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => router.push(`/nft/${rental.id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
