// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import { IERC20 } from '@openzeppelin/contracts/interfaces/IERC20.sol';

contract HeyTipping is
  Initializable,
  OwnableUpgradeable,
  ReentrancyGuardUpgradeable,
  PausableUpgradeable
{
  uint256 public feesBps;
  mapping(bytes32 => mapping(bytes32 => bool)) public hasTipped;

  event TipSent(
    address indexed token,
    address indexed from,
    address indexed to,
    uint256 amount,
    string profileId,
    string publicationId
  );

  error TipFailed(string message);
  error InsufficientAllowance(string message);

  // Initializer instead of constructor for upgradeable contracts
  function initialize(address owner, uint256 _feesBps) public initializer {
    __Ownable_init(owner);
    __ReentrancyGuard_init();
    __Pausable_init();
    feesBps = _feesBps;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function setFees(uint256 _feesBps) external onlyOwner {
    feesBps = _feesBps;
  }

  function checkIfTipped(
    string memory profileId,
    string memory publicationId
  ) public view returns (bool) {
    bytes32 profileHash = keccak256(abi.encodePacked(profileId));
    bytes32 publicationHash = keccak256(abi.encodePacked(publicationId));

    return hasTipped[profileHash][publicationHash];
  }

  function checkAllowance(
    address tokenAddress,
    address owner
  ) public view returns (uint256) {
    IERC20 token = IERC20(tokenAddress);
    return token.allowance(owner, address(this));
  }

  function tip(
    address tokenAddress,
    address recipient,
    uint256 amount,
    string calldata profileId,
    string calldata publicationId
  ) public whenNotPaused nonReentrant {
    bytes32 profileHash = keccak256(abi.encodePacked(profileId));
    bytes32 publicationHash = keccak256(abi.encodePacked(publicationId));
    IERC20 token = IERC20(tokenAddress);

    uint256 allowed = token.allowance(msg.sender, address(this));
    if (allowed < amount) {
      revert InsufficientAllowance('Not enough allowance');
    }

    // Calculate fee and net amount
    uint256 fee = (amount * feesBps) / 10000;
    uint256 netAmount = amount - fee;

    // Transfer fee to the owner and net amount to the recipient in one go
    if (
      !token.transferFrom(msg.sender, owner(), fee) ||
      !token.transferFrom(msg.sender, recipient, netAmount)
    ) {
      revert TipFailed('Transfer failed');
    }

    hasTipped[profileHash][publicationHash] = true;
    emit TipSent(
      tokenAddress,
      msg.sender,
      recipient,
      netAmount,
      profileId,
      publicationId
    );
  }
}
