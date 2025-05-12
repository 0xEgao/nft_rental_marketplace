const hre = require("hardhat")

async function main() {
  // Deploy the RentalMarketplace contract
  const RentalMarketplace = await hre.ethers.getContractFactory("RentalMarketplace")
  const rentalMarketplace = await RentalMarketplace.deploy()
  await rentalMarketplace.deployed()
  console.log("RentalMarketplace deployed to:", rentalMarketplace.address)

  // Deploy the TestNFT contract
  const TestNFT = await hre.ethers.getContractFactory("TestNFT")
  const testNFT = await TestNFT.deploy()
  await testNFT.deployed()
  console.log("TestNFT deployed to:", testNFT.address)

  // Mint some test NFTs
  const [deployer] = await hre.ethers.getSigners()

  for (let i = 1; i <= 5; i++) {
    const tx = await testNFT.mint(deployer.address, `https://example.com/nft/${i}`)
    await tx.wait()
    console.log(`Minted NFT #${i} to ${deployer.address}`)
  }

  console.log("Deployment and setup complete!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
