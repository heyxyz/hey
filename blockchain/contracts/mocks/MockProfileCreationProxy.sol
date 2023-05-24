// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import {ILensHub} from '../interfaces/ILensHub.sol';
import {DataTypes} from '../libraries/DataTypes.sol';
import {Errors} from '../libraries/Errors.sol';

/**
 * @title MockProfileCreationProxy
 * @author Lens Protocol
 *
 * @notice This is a proxy contract that enforces ".test" handle suffixes and adds char validations at profile creation.
 */
contract MockProfileCreationProxy {
    ILensHub immutable LENS_HUB;

    constructor(ILensHub hub) {
        LENS_HUB = hub;
    }

    function proxyCreateProfile(DataTypes.CreateProfileData memory vars) external {
        (bool successLens, bytes memory dataLens) = 0x28af365578586eD5Fd500A1Dc0a3E20Fc7b2Cffa.call(
            abi.encodeWithSignature('balanceOf(address)', msg.sender)
        );
        uint256 balanceLens = abi.decode(dataLens, (uint256));

        require(successLens, 'Failed to call LensHub');
        require(balanceLens == 0, 'Already has a Lens handle');

        (bool successEns, bytes memory dataEns) = 0x117F113aEFb9AeD23d901C1fa02fDdaA1d20cCaB.call(
            abi.encodeWithSignature('balanceOf(address)', msg.sender)
        );
        uint256 balanceEns = abi.decode(dataEns, (uint256));

        require(successEns, 'Failed to call ENS resolver');
        require(balanceEns > 0, "Doesn't have an ENS token");

        uint256 handleLength = bytes(vars.handle).length;
        if (handleLength < 5) revert Errors.HandleLengthInvalid();

        bytes1 firstByte = bytes(vars.handle)[0];
        if (firstByte == '-' || firstByte == '_' || firstByte == '.')
            revert Errors.HandleFirstCharInvalid();

        for (uint256 i = 1; i < handleLength;) {
            if (bytes(vars.handle)[i] == '.') revert Errors.HandleContainsInvalidCharacters();
            unchecked {
                ++i;
            }
        }

        vars.handle = string(abi.encodePacked(vars.handle, '.test'));
        LENS_HUB.createProfile(vars);
    }
}
