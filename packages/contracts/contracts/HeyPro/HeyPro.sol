// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract HeyPro is Initializable, OwnableUpgradeable {
  uint256 constant MONTH = 30 days;
  uint256 constant YEAR = 365 days;
  uint256 public monthlyPrice;
  uint256 public yearlyPrice;
  mapping(uint256 => uint256) public proExpiresAt;

  event SubscriptionUpdated(uint256 profileId, uint256 newExpiryDate);

  error InvalidFunds();
  error NotAllowed();
  error WithdrawalFailed();
  error TransferFailed();

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address owner,
    uint256 _monthlyPrice,
    uint256 _yearlyPrice
  ) public initializer {
    __Ownable_init(owner);
    monthlyPrice = _monthlyPrice;
    yearlyPrice = _yearlyPrice;
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
    emit SubscriptionUpdated(profileId, proExpiresAt[profileId]);
  }

  function subscribeMonthly(uint256 profileId) public payable {
    if (msg.value != monthlyPrice) revert InvalidFunds();
    extendSubscription(profileId, MONTH);
    _transferFunds();
  }

  function subscribeYearly(uint256 profileId) public payable {
    if (msg.value != yearlyPrice) revert InvalidFunds();
    extendSubscription(profileId, YEAR);
    _transferFunds();
  }

  function isProMonthly(uint256 profileId) public view returns (bool) {
    return
      proExpiresAt[profileId] >= block.timestamp &&
      proExpiresAt[profileId] <= block.timestamp + MONTH;
  }

  function isProYearly(uint256 profileId) public view returns (bool) {
    return
      proExpiresAt[profileId] >= block.timestamp &&
      proExpiresAt[profileId] > block.timestamp + MONTH;
  }

  function refund(uint256 profileId) public {
    if (proExpiresAt[profileId] <= block.timestamp) revert NotAllowed();

    uint256 remainingTime = proExpiresAt[profileId] - block.timestamp;
    uint256 refundAmount;

    if (remainingTime > MONTH) {
      refundAmount = (remainingTime / YEAR) * yearlyPrice;
    } else {
      refundAmount = (remainingTime / MONTH) * monthlyPrice;
    }

    proExpiresAt[profileId] = block.timestamp; // Ends the subscription

    (bool sent, ) = msg.sender.call{ value: refundAmount }('');
    if (!sent) revert WithdrawalFailed();
  }

  function _transferFunds() private {
    (bool sent, ) = owner().call{ value: msg.value }('');
    if (!sent) revert TransferFailed();
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
