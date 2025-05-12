import { ConnectButton } from "@/components/connect-button"
import { NFTListings } from "@/components/nft-listings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyListings } from "@/components/my-listings"
import { MyRentals } from "@/components/my-rentals"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">NFT Rental Marketplace</h1>
            <p className="mt-2 text-muted-foreground">Rent and list NFTs on the blockchain</p>
          </div>
          <div className="mt-4 md:mt-0">
            <ConnectButton />
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse NFTs</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="my-rentals">My Rentals</TabsTrigger>
          </TabsList>
          <TabsContent value="browse" className="mt-6">
            <NFTListings />
          </TabsContent>
          <TabsContent value="my-listings" className="mt-6">
            <MyListings />
          </TabsContent>
          <TabsContent value="my-rentals" className="mt-6">
            <MyRentals />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
