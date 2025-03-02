// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HeyPro is ERC721Enumerable, Ownable, AccessControl {
    struct NFTData {
        uint256 expiry;
        string name;
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(uint256 => NFTData) public nftDetails;

    constructor() ERC721("HeyPro", "PRO") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function mint() external {
        uint256 tokenId = totalSupply() + 1;
        uint256 currentTime = block.timestamp;
        uint256 expiry = currentTime + 30 days;

        string memory nftName = _uintToString(currentTime);

        _safeMint(msg.sender, tokenId);
        nftDetails[tokenId] = NFTData(expiry, nftName);
    }

    function burnExpiredNFTs() external onlyRole(ADMIN_ROLE) {
        uint256 total = totalSupply();
        uint256 burnedCount = 0;

        for (uint256 i = total; i > 0; i--) {
            if (_tokenExists(i) && nftDetails[i].expiry <= block.timestamp) {
                _burn(i);
                delete nftDetails[i];
                burnedCount++;
            }
        }

        require(burnedCount > 0, "No expired NFTs to burn");
    }

    function addAdmin(address admin) external onlyOwner {
        grantRole(ADMIN_ROLE, admin);
    }

    function removeAdmin(address admin) external onlyOwner {
        revokeRole(ADMIN_ROLE, admin);
    }

    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    function _uintToString(uint256 value) internal pure returns (string memory) {
        bytes memory buffer = new bytes(10);
        for (uint256 i = 9; i >= 0; i--) {
            buffer[i] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
            if (value == 0) break;
        }
        return string(buffer);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
