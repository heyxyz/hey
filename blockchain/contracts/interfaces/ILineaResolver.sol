// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

/**
@title ILineaResolver
@dev A Solidity contract that implements an ERC721 token for resolving Ethereum domain names to addresses.
@author ConsenSys
*/
interface ILineaResolver {
 
  /**
   * @dev Emitted when the address associated with a specific node is changed.
   * @param node The bytes32 value representing the node whose address is being changed.
   * @param a The new address that is being associated with the node.
   */
  event AddrChanged(bytes32 indexed node, address a);

  /**
   * @dev Mints a new subdomain token for the given name and address.
   * @notice This function is used to mint a new subdomain token for the given name and address.
   * @param name The name of the subdomain to mint.
   * @param _addr The address associated with the subdomain.
   */
  function mintSubdomain(string memory name, address _addr) external payable;

  /**
   * @dev Resolves an Ethereum domain.
   * @notice This function is used to resolve an Ethereum domain.
   * @param node The ENS node to resolve.
   * @return The address associated with the resolved ENS node, or address(0) if not found.
   */
  function resolve(bytes32 node) external view returns (address);

  function exists(uint256 _tokenId) external view returns (bool);

  /**
   * @dev Sets the base token URI.
   * @notice This function is used to set the base URI for token metadata of an ERC721 contract.
   * @param baseURI The new base URI for token metadata.
   * @return The updated base token URI.
   */
  function setBaseTokenURI(
    string memory baseURI
  ) external returns (string memory);

  /**
   * @dev Sets the base fee to mint a sub domain
   * @param newBaseFee the new base fee used to send to mint a sub domain
   */
  function setBaseFee(uint256 newBaseFee) external;

  /**
   * @dev Retrieves the token URI for a specific ERC721 token.
   * @notice This function retrieves the token URI associated with the specified ERC721 token ID.
   * @param tokenId The ID of the ERC721 token to retrieve the token URI for.
   * @return The token URI associated with the specified ERC721 token ID.
   */
  function tokenURI(
    uint256 tokenId
  ) external view returns (string memory);

  /**
   * @dev Retrieves the name associated with a specific ERC721 token.
   * @notice This function retrieves the name associated with the specified ERC721 token ID.
   * @param tokenId The ID of the ERC721 token to retrieve the name for.
   * @return The name associated with the specified ERC721 token ID.
   */
  function tokenName(uint256 tokenId) external view returns (string memory);

  /**
   * @dev Burns a specific ERC721 token.
   * @notice This function is used to burn a specific ERC721 token by its token ID.
   * @param tokenId The ID of the ERC721 token to be burned.
   */
  function burn(uint256 tokenId) external;

  /**
   * @dev Get the BalanceOf ENS tokens Lens handle.
   * @notice This function is used to get the balance of ENS tokens.
   * @param wallet  The address wallet of the  user.
   * @return The number of tokens.
   */
  function balanceOf(address wallet) external view returns (uint256);
}
