// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract HeyTipping is
  Initializable,
  OwnableUpgradeable,
  ReentrancyGuardUpgradeable,
  PausableUpgradeable
{
  using SafeERC20 for IERC20;
  uint256 public feesBps;

  event TipSent(
    uint256 indexed fromProfileId,
    uint256 indexed toProfileId,
    uint256 indexed publicationId,
    address token,
    address from,
    address to,
    uint256 amount
  );

  error TipFailed(string message);
  error InsufficientAllowance(string message);
  error FeesBpsTooHigh();

  // Initializer instead of constructor for upgradeable contracts
  function initialize(address owner, uint256 _feesBps) public initializer {
    __Ownable_init(owner);
    __ReentrancyGuard_init();
    __Pausable_init();
    feesBps = _feesBps;
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  function setFees(uint256 _feesBps) external onlyOwner {
    if (_feesBps > 10000) {
      revert FeesBpsTooHigh();
    }

    feesBps = _feesBps;
  }

  function checkAllowance(
    address tokenAddress,
    address owner
  ) external view returns (uint256) {
    IERC20 token = IERC20(tokenAddress);
    return token.allowance(owner, address(this));
  }

  function tip(
    address tokenAddress,
    address recipient,
    uint256 amount,
    uint256 fromProfileId,
    uint256 toProfileId,
    uint256 publicationId
  ) external whenNotPaused nonReentrant {
    IERC20 token = IERC20(tokenAddress);

    // Calculate fee and net amount
    uint256 fee = (amount * feesBps) / 10000;
    uint256 netAmount = amount - fee;

    token.safeTransferFrom(msg.sender, owner(), fee);
    token.safeTransferFrom(msg.sender, recipient, netAmount);

    emit TipSent(
      fromProfileId,
      toProfileId,
      publicationId,
      tokenAddress,
      msg.sender,
      recipient,
      netAmount
    );
  }
}
