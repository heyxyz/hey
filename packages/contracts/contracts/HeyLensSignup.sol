// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface IPermissonlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256, uint256);
}

contract HeyLensSignup is Initializable, OwnableUpgradeable {
  IPermissonlessCreator public permissonlessCreator;
  uint256 public profileWithHandleCreationCost;

  error InvalidFunds();
  error NotAllowed();
  error WithdrawalFailed();

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address _permissonlessCreator,
    address owner
  ) public initializer {
    __Ownable_init(owner);
    permissonlessCreator = IPermissonlessCreator(_permissonlessCreator);
    profileWithHandleCreationCost = 1 ether;
  }

  function setSignupPrice(
    uint256 _profileWithHandleCreationCost
  ) external onlyOwner {
    profileWithHandleCreationCost = _profileWithHandleCreationCost;
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value != profileWithHandleCreationCost) {
      revert InvalidFunds();
    }

    if (delegatedExecutors.length > 0 && createProfileParams.to != msg.sender) {
      revert NotAllowed();
    }

    // Call the permissonlessCreator to create a profile
    return
      permissonlessCreator.createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );
  }

  function withdrawFunds() external onlyOwner {
    (bool sent, ) = payable(owner()).call{ value: address(this).balance }('');
    if (!sent) {
      revert WithdrawalFailed();
    }
  }
}
