
# 🏠 Onchain NFT Rental Marketplace

A fully on-chain decentralized rental system where users can list, rent, and reclaim **ERC721 NFTs** for a fixed duration using ETH.

---

## ✨ Features

* List your NFTs with custom price and max rental duration
* Rent NFTs using ETH for a chosen number of days
* NFTs are held in escrow during rentals
* Owners can reclaim NFTs after rental expires
* Delisting option for unrented NFTs
* Transparent state changes via events

---

## 🛠️ Tech Stack

* **Smart Contracts:** Solidity (Hardhat)
* **Frontend:** Next.js
* **Network:** Sepolia via Alchemy

---

## ⚙️ Core Flows

### 📤 List NFT

Owners approve and list their NFT with a daily price and rental limit.

### 🔄 Rent NFT

Renters pay upfront ETH for a specified duration. The NFT is locked in the contract.

### ⏱️ End Rental

After expiry, the owner can reclaim their NFT.

### ❌ Delist

Owners can remove unrented NFTs from the marketplace.

---

## 🔔 Events Emitted

* `NFTListed`
* `NFTRented`
* `RentalEnded`
* `NFTDelisted`

---

## 🚀 Try It Out

1. Deploy contracts using Hardhat
2. Use Alchemy Sepolia to interact on testnet
3. Frontend built with Next.js for easy wallet interaction and tracking rentals


