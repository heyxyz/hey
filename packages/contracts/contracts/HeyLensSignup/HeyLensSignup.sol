// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface ILensPermissionlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256, uint256);
}

contract HeyLensSignup is Initializable, OwnableUpgradeable {
  ILensPermissionlessCreator public lensPermissionlessCreator;
  uint256 public signupPrice;
  uint256 public profilesCreatedViaCard;
  uint256 public profilesCreatedViaCrypto;
  mapping(uint256 => bool) public profileCreated;
  mapping(address => bool) public allowedAddresses;

  modifier onlyAllowed() {
    require(allowedAddresses[msg.sender], 'HeyLensSignup: Not allowed');
    _;
  }

  event ProfileCreated(uint256 profileId, uint256 handleId);

  error InvalidFunds();
  error NotAllowed();
  error WithdrawalFailed();

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address owner,
    address _lensPermissionlessCreator,
    uint256 _signupPrice
  ) public initializer {
    __Ownable_init(owner);
    lensPermissionlessCreator = ILensPermissionlessCreator(
      _lensPermissionlessCreator
    );
    signupPrice = _signupPrice;
    profilesCreatedViaCard = 0;
    profilesCreatedViaCrypto = 0;
  }

  function addAllowedAddresses(
    address[] calldata newAddresses
  ) external onlyOwner {
    for (uint256 i = 0; i < newAddresses.length; i++) {
      allowedAddresses[newAddresses[i]] = true;
    }
  }

  function removeAllowedAddress(address addressToRemove) external onlyOwner {
    allowedAddresses[addressToRemove] = false;
  }

  function setSignupPrice(uint256 _signupPrice) external onlyOwner {
    signupPrice = _signupPrice;
  }

  function setLensPermissionlessCreatorAddress(
    address creatorAddress
  ) external onlyOwner {
    lensPermissionlessCreator = ILensPermissionlessCreator(creatorAddress);
  }

  function totalProfilesCreated() external view returns (uint256) {
    return profilesCreatedViaCard + profilesCreatedViaCrypto;
  }

  function createProfileWithHandle(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external onlyAllowed returns (uint256 profileId, uint256 handleId) {
    // Call the lensPermissionlessCreator to create a profile
    (profileId, handleId) = lensPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    // Mark the profile as created
    profileCreated[profileId] = true;
    profilesCreatedViaCard++;

    // Emit the event to signal that a profile has been successfully created
    emit ProfileCreated(profileId, handleId);

    return (profileId, handleId);
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value < signupPrice) {
      revert InvalidFunds();
    }

    if (delegatedExecutors.length > 0 && createProfileParams.to != msg.sender) {
      revert NotAllowed();
    }

    // Call the lensPermissionlessCreator to create a profile
    (profileId, handleId) = lensPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    // Mark the profile as created
    profileCreated[profileId] = true;
    profilesCreatedViaCrypto++;

    // Emit the event to signal that a profile has been successfully created
    emit ProfileCreated(profileId, handleId);

    return (profileId, handleId);
  }

  // Remove this function on V2 and add direct transfer of funds to the owner
  function withdrawFunds() external onlyOwner {
    (bool sent, ) = payable(owner()).call{ value: address(this).balance }('');
    if (!sent) {
      revert WithdrawalFailed();
    }
  }
}
