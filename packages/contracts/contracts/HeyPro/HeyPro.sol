// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';

contract HeyPro is
  Initializable,
  OwnableUpgradeable,
  ReentrancyGuardUpgradeable,
  PausableUpgradeable
{
  uint256 constant MONTH = 30 days;
  uint256 constant YEAR = 365 days;
  uint256 public monthlyPrice;
  uint256 public yearlyPrice;
  mapping(uint256 => address) public profileToAddress;
  mapping(uint256 => uint256) public proExpiresAt;

  event SubscriptionUpdated(
    uint256 indexed profileId,
    uint256 indexed newExpiryDate
  );

  error InvalidFunds(string message);
  error TransferFailed(string message);

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address owner,
    uint256 _monthlyPrice,
    uint256 _yearlyPrice
  ) public initializer {
    __Ownable_init(owner);
    __ReentrancyGuard_init();
    __Pausable_init();
    monthlyPrice = _monthlyPrice;
    yearlyPrice = _yearlyPrice;
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  function setMonthlyPrice(uint256 _monthlyPrice) external onlyOwner {
    monthlyPrice = _monthlyPrice;
  }

  function setYearlyPrice(uint256 _yearlyPrice) external onlyOwner {
    yearlyPrice = _yearlyPrice;
  }

  function extendSubscription(uint256 profileId, uint256 duration) private {
    if (proExpiresAt[profileId] > block.timestamp) {
      proExpiresAt[profileId] += duration;
    } else {
      proExpiresAt[profileId] = block.timestamp + duration;
    }
    profileToAddress[profileId] = msg.sender;

    emit SubscriptionUpdated(profileId, proExpiresAt[profileId]);
  }

  function subscribeMonthly(
    uint256 profileId
  ) external payable whenNotPaused nonReentrant {
    if (msg.value != monthlyPrice) {
      revert InvalidFunds('Monthly subscription funds are incorrect');
    }
    extendSubscription(profileId, MONTH);
    _transferFunds();
  }

  function subscribeYearly(
    uint256 profileId
  ) external payable whenNotPaused nonReentrant {
    if (msg.value != yearlyPrice) {
      revert InvalidFunds('Yearly subscription funds are incorrect');
    }
    extendSubscription(profileId, YEAR);
    _transferFunds();
  }

  // Only owner can extend subscription for pro to any profile for any duration
  function subscribePro(
    uint256 profileId,
    uint256 duration
  ) external onlyOwner whenNotPaused nonReentrant {
    extendSubscription(profileId, duration);
  }

  function _transferFunds() private {
    (bool sent, ) = owner().call{ value: msg.value }('');
    if (!sent) {
      revert TransferFailed('Failed to transfer funds to owner');
    }
  }
}
