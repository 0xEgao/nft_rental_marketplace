// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TestNFT
 * @dev A simple ERC721 contract for testing the rental marketplace
 */
contract TestNFT is ERC721URIStorage, ERC2981, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Test NFT", "TNFT") Ownable(msg.sender) {
        // Set default royalty to 5%
        _setDefaultRoyalty(msg.sender, 500);
    }

    /**
     * @dev Mints a new NFT
     * @param recipient Address to mint the NFT to
     * @param tokenURI URI for the token metadata
     * @return New token ID
     */
    function mint(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }

    /**
     * @dev Sets royalty information for a specific token
     * @param tokenId Token ID to set royalty for
     * @param receiver Address to receive royalties
     * @param feeNumerator Fee numerator (e.g., 500 for 5%)
     */
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // The following functions are overrides required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
