// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HeyPro is ERC721Enumerable, Ownable {
    struct NFTData {
        uint256 expiry;
        string name;
    }

    mapping(uint256 => NFTData) public nftDetails;

    constructor() ERC721("HeyPro", "PRO") Ownable(msg.sender) {}

    function mint() external {
        uint256 tokenId = totalSupply() + 1;
        uint256 currentTime = block.timestamp;
        uint256 expiry = currentTime + 30 days;

        // NFT name derived from epoch timestamp (10 chars)
        string memory nftName = _uintToString(currentTime);

        _safeMint(msg.sender, tokenId);
        nftDetails[tokenId] = NFTData(expiry, nftName);
    }

    function extendSubscription() external {
        uint256 lastTokenId = balanceOf(msg.sender);
        require(lastTokenId > 0, "You don't own any NFTs");

        uint256 tokenId = tokenOfOwnerByIndex(msg.sender, lastTokenId - 1);
        require(
            nftDetails[tokenId].expiry > block.timestamp,
            "Subscription expired"
        );

        // Extend by 30 days
        nftDetails[tokenId].expiry += 30 days;
    }

    function getNFTDetails(
        uint256 tokenId
    ) external view returns (string memory, uint256) {
        require(_isValidToken(tokenId), "Token does not exist");
        return (nftDetails[tokenId].name, nftDetails[tokenId].expiry);
    }

    function _uintToString(
        uint256 value
    ) internal pure returns (string memory) {
        bytes memory buffer = new bytes(10);
        for (uint256 i = 9; i >= 0; i--) {
            buffer[i] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
            if (value == 0) break;
        }
        return string(buffer);
    }

    function _isValidToken(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= totalSupply();
    }
}
