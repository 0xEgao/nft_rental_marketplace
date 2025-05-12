export const RENTAL_MARKETPLACE_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "listingId",
        type: "uint256",
      },
    ],
    name: "delistNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAvailableListings",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "lister",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pricePerDay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "enum RentalMarketplace.ListingStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "renter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rentalEndTime",
            type: "uint256",
          },
        ],
        internalType: "struct RentalMarketplace.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "listingId",
        type: "uint256",
      },
    ],
    name: "getListing",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "lister",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pricePerDay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "enum RentalMarketplace.ListingStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "renter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rentalEndTime",
            type: "uint256",
          },
        ],
        internalType: "struct RentalMarketplace.Listing",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserListings",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "lister",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pricePerDay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "enum RentalMarketplace.ListingStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "renter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rentalEndTime",
            type: "uint256",
          },
        ],
        internalType: "struct RentalMarketplace.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserRentals",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "lister",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pricePerDay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "enum RentalMarketplace.ListingStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "renter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rentalEndTime",
            type: "uint256",
          },
        ],
        internalType: "struct RentalMarketplace.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rentalPricePerDay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxRentDurationDays",
        type: "uint256",
      },
    ],
    name: "listNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "listingId",
        type: "uint256",
      },
    ],
    name: "reclaimNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "listingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "durationDaysToRent",
        type: "uint256",
      },
    ],
    name: "rentNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
]
