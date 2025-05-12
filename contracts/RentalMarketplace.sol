// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RentalMarketplace
 * @dev A marketplace for renting ERC721 NFTs
 */
contract RentalMarketplace is ERC721Holder, Ownable, ReentrancyGuard {
    // Enum to track the status of a listing
    enum ListingStatus { Available, Rented }

    // Struct to store listing information
    struct Listing {
        uint256 id;
        address nftContract;
        uint256 tokenId;
        address lister;
        uint256 pricePerDay;
        uint256 maxDuration;
        ListingStatus status;
        address renter;
        uint256 rentalEndTime;
    }

    // Counter for listing IDs
    uint256 private _nextListingId = 1;

    // Marketplace fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public marketplaceFeePercent = 250; // Default 2.5%

    // Mapping from listing ID to Listing
    mapping(uint256 => Listing) private _listings;
    
    // Mapping from user address to their listing IDs
    mapping(address => uint256[]) private _userListings;
    
    // Mapping from user address to their rental IDs
    mapping(address => uint256[]) private _userRentals;

    // Events
    event NFTListed(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address lister, uint256 pricePerDay, uint256 maxDuration);
    event NFTRented(uint256 indexed listingId, address indexed renter, uint256 rentalEndTime, uint256 totalFee);
    event RentalEnded(uint256 indexed listingId, uint256 tokenId);
    event NFTDelisted(uint256 indexed listingId);
    event MarketplaceFeeUpdated(uint256 newFeePercent);
    
    // Optional AI-related storage and events (commented out for now)
    // event AISuggestedPriceUpdated(uint256 indexed listingId, uint256 suggestedPrice);
    // event NFTAIScoreUpdated(address indexed nftContract, uint256 indexed tokenId, uint8 score);
    // address public aiOracle;
    // mapping(uint256 => uint256) public aiSuggestedPricePerDay;
    // mapping(address => mapping(uint256 => uint8)) public nftAIScore;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Sets the marketplace fee percentage
     * @param newFeePercent New fee percentage in basis points (e.g., 250 = 2.5%)
     */
    function setMarketplaceFeePercent(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        marketplaceFeePercent = newFeePercent;
        emit MarketplaceFeeUpdated(newFeePercent);
    }

    /**
     * @dev Lists an NFT for rent
     * @param nftContractAddress Address of the NFT contract
     * @param tokenId ID of the token to list
     * @param rentalPricePerDay Price per day in wei
     * @param maxRentDurationDays Maximum rental duration in days
     */
    function listNFT(
        address nftContractAddress,
        uint256 tokenId,
        uint256 rentalPricePerDay,
        uint256 maxRentDurationDays
    ) external nonReentrant {
        require(nftContractAddress != address(0), "Invalid NFT contract");
        require(rentalPricePerDay > 0, "Price must be > 0");
        require(maxRentDurationDays > 0, "Duration must be > 0");
        
        // Check if caller is the owner of the NFT
        IERC721 nftContract = IERC721(nftContractAddress);
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        
        // Transfer NFT to marketplace
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        
        // Create listing
        uint256 listingId = _nextListingId++;
        _listings[listingId] = Listing({
            id: listingId,
            nftContract: nftContractAddress,
            tokenId: tokenId,
            lister: msg.sender,
            pricePerDay: rentalPricePerDay,
            maxDuration: maxRentDurationDays,
            status: ListingStatus.Available,
            renter: address(0),
            rentalEndTime: 0
        });
        
        // Add to user's listings
        _userListings[msg.sender].push(listingId);
        
        emit NFTListed(listingId, nftContractAddress, tokenId, msg.sender, rentalPricePerDay, maxRentDurationDays);
    }

    /**
     * @dev Rents an NFT
     * @param listingId ID of the listing
     * @param durationDaysToRent Duration to rent in days
     */
    function rentNFT(uint256 listingId, uint256 durationDaysToRent) external payable nonReentrant {
        Listing storage listing = _listings[listingId];
        
        require(listing.id != 0, "Listing does not exist");
        require(listing.status == ListingStatus.Available, "Not available for rent");
        require(durationDaysToRent > 0 && durationDaysToRent <= listing.maxDuration, "Invalid duration");
        
        uint256 totalRentalFee = listing.pricePerDay * durationDaysToRent;
        require(msg.value >= totalRentalFee, "Insufficient payment");
        
        // Update listing status
        listing.status = ListingStatus.Rented;
        listing.renter = msg.sender;
        listing.rentalEndTime = block.timestamp + (durationDaysToRent * 1 days);
        
        // Add to user's rentals
        _userRentals[msg.sender].push(listingId);
        
        // Handle royalties if supported
        uint256 marketplaceFee = (totalRentalFee * marketplaceFeePercent) / 10000;
        uint256 remainingAmount = totalRentalFee - marketplaceFee;
        uint256 royaltyAmount = 0;
        
        try ERC2981(listing.nftContract).royaltyInfo(listing.tokenId, totalRentalFee) returns (address receiver, uint256 royalty) {
            if (royalty > 0 && receiver != address(0)) {
                royaltyAmount = royalty;
                remainingAmount -= royaltyAmount;
                
                // Transfer royalty to receiver
                (bool royaltySuccess, ) = payable(receiver).call{value: royaltyAmount}("");
                require(royaltySuccess, "Royalty transfer failed");
            }
        } catch {}
        
        // Transfer remaining amount to lister
        (bool success, ) = payable(listing.lister).call{value: remainingAmount}("");
        require(success, "Payment transfer failed");
        
        emit NFTRented(listingId, msg.sender, listing.rentalEndTime, totalRentalFee);
        
        // Refund excess payment if any
        if (msg.value > totalRentalFee) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalRentalFee}("");
            require(refundSuccess, "Refund failed");
        }
    }

    /**
     * @dev Reclaims an NFT after rental period
     * @param listingId ID of the listing
     */
    function reclaimNFT(uint256 listingId) external nonReentrant {
        Listing storage listing = _listings[listingId];
        
        require(listing.id != 0, "Listing does not exist");
        require(listing.status == ListingStatus.Rented, "Not rented");
        require(listing.lister == msg.sender, "Not the lister");
        require(block.timestamp >= listing.rentalEndTime, "Rental period not over");
        
        // Reset rental info
        listing.status = ListingStatus.Available;
        listing.renter = address(0);
        listing.rentalEndTime = 0;
        
        emit RentalEnded(listingId, listing.tokenId);
    }

    /**
     * @dev Delists an NFT
     * @param listingId ID of the listing
     */
    function delistNFT(uint256 listingId) external nonReentrant {
        Listing storage listing = _listings[listingId];
        
        require(listing.id != 0, "Listing does not exist");
        require(listing.lister == msg.sender, "Not the lister");
        require(listing.status == ListingStatus.Available, "Cannot delist while rented");
        
        // Transfer NFT back to lister
        IERC721(listing.nftContract).safeTransferFrom(address(this), listing.lister, listing.tokenId);
        
        // Remove from user's listings (simplified - in production would need to handle array manipulation better)
        delete _listings[listingId];
        
        emit NFTDelisted(listingId);
    }

    /**
     * @dev Withdraws marketplace fees
     */
    function withdrawMarketplaceFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Gets a listing by ID
     * @param listingId ID of the listing
     * @return Listing information
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        require(_listings[listingId].id != 0, "Listing does not exist");
        return _listings[listingId];
    }

    /**
     * @dev Gets all available listings
     * @return Array of available listings
     */
    function getAvailableListings() external view returns (Listing[] memory) {
        uint256 count = 0;
        
        // Count available listings
        for (uint256 i = 1; i < _nextListingId; i++) {
            if (_listings[i].id != 0 && _listings[i].status == ListingStatus.Available) {
                count++;
            }
        }
        
        Listing[] memory availableListings = new Listing[](count);
        uint256 index = 0;
        
        // Populate array
        for (uint256 i = 1; i < _nextListingId; i++) {
            if (_listings[i].id != 0 && _listings[i].status == ListingStatus.Available) {
                availableListings[index] = _listings[i];
                index++;
            }
        }
        
        return availableListings;
    }

    /**
     * @dev Gets all listings by a user
     * @param user Address of the user
     * @return Array of user's listings
     */
    function getUserListings(address user) external view returns (Listing[] memory) {
        uint256[] memory listingIds = _userListings[user];
        Listing[] memory userListings = new Listing[](listingIds.length);
        
        for (uint256 i = 0; i < listingIds.length; i++) {
            if (_listings[listingIds[i]].id != 0) {
                userListings[i] = _listings[listingIds[i]];
            }
        }
        
        return userListings;
    }

    /**
     * @dev Gets all rentals by a user
     * @param user Address of the user
     * @return Array of user's rentals
     */
    function getUserRentals(address user) external view returns (Listing[] memory) {
        uint256[] memory rentalIds = _userRentals[user];
        Listing[] memory userRentals = new Listing[](rentalIds.length);
        
        for (uint256 i = 0; i < rentalIds.length; i++) {
            if (_listings[rentalIds[i]].id != 0 && _listings[rentalIds[i]].renter == user) {
                userRentals[i] = _listings[rentalIds[i]];
            }
        }
        
        return userRentals;
    }

    // Optional AI-related functions (commented out for now)
    /*
    function setAIOracle(address _aiOracle) external onlyOwner {
        aiOracle = _aiOracle;
    }

    function updateAISuggestedPrice(uint256 listingId, uint256 suggestedPrice) external {
        require(msg.sender == aiOracle, "Not authorized");
        require(_listings[listingId].id != 0, "Listing does not exist");
        
        aiSuggestedPricePerDay[listingId] = suggestedPrice;
        
        emit AISuggestedPriceUpdated(listingId, suggestedPrice);
    }

    function updateNFTAIScore(address nftContract, uint256 tokenId, uint8 score) external {
        require(msg.sender == aiOracle, "Not authorized");
        
        nftAIScore[nftContract][tokenId] = score;
        
        emit NFTAIScoreUpdated(nftContract, tokenId, score);
    }
    */
}
