// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

/**
@title ILineaResolver
@dev A Solidity contract that implements an ERC721 token for resolving Ethereum domain names to addresses.
@author ConsenSys
*/
interface ILineaResolver {
  // Mapping to store Ethereum domain names (as bytes32) and their corresponding addresses (as uint256)
  mapping(bytes32 => uint256) public addresses;
  // Mapping to store token IDs (as uint256) and their corresponding domain name (as string)
  mapping(uint256 => string) public tokenDomains;
  // Counter to keep track of token IDs for minting new tokens
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  // Private string variable to store the base URI for the token URI generation
  string private _baseTokenURI;

  // Fees to send to mint a sub domain, initial set to 0.001 ETH
  uint256 public baseFee = 1000000000000000;

  /**
   * @dev Emitted when the address associated with a specific node is changed.
   * @param node The bytes32 value representing the node whose address is being changed.
   * @param a The new address that is being associated with the node.
   */
  event AddrChanged(bytes32 indexed node, address a);

  /**
   * @dev Constructor function to initialize the ERC721 contract with the given name, symbol, and base URI.
   * @notice This constructor function is used to initialize the ERC721 contract with the given name, symbol, and base URI.
   * @param _name The name of the ERC721 token.
   * @param _symbol The symbol of the ERC721 token.
   * @param baseURI The base URI for the token URI.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory baseURI
  ) ERC721(_name, _symbol) {
    _baseTokenURI = baseURI;
    _tokenIds.increment();
  }

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
  ) external onlyOwner returns (string memory);

  /**
   * @dev Sets the base fee to mint a sub domain
   * @param newBaseFee the new base fee used to send to mint a sub domain
   */
  function setBaseFee(uint256 newBaseFee) external onlyOwner {
    baseFee = newBaseFee;
  }

  /**
   * @dev Retrieves the token URI for a specific ERC721 token.
   * @notice This function retrieves the token URI associated with the specified ERC721 token ID.
   * @param tokenId The ID of the ERC721 token to retrieve the token URI for.
   * @return The token URI associated with the specified ERC721 token ID.
   */
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory);

  /**
   * @dev Retrieves the name associated with a specific ERC721 token.
   * @notice This function retrieves the name associated with the specified ERC721 token ID.
   * @param tokenId The ID of the ERC721 token to retrieve the name for.
   * @return The name associated with the specified ERC721 token ID.
   */
  function tokenName(uint256 tokenId) public view returns (string memory) {
    return tokenDomains[tokenId];
  }

  /**
   * @dev Burns a specific ERC721 token.
   * @notice This function is used to burn a specific ERC721 token by its token ID.
   * @param tokenId The ID of the ERC721 token to be burned.
   */
  function burn(uint256 tokenId) external;


    function balanceOf(address wallet) external view returns (uint256);
}
