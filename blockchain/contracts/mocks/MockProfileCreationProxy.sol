// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import {ILensHub} from '../interfaces/ILensHub.sol';
import {DataTypes} from '../libraries/DataTypes.sol';
import {Errors} from '../libraries/Errors.sol';
import {ILineaResolver} from '../interfaces/ILineaResolver.sol';

/**
 * @title MockProfileCreationProxy
 * @author Lens Protocol
 *
 * @notice This is a proxy contract that enforces ".test" handle suffixes and adds char validations at profile creation.
 */
contract MockProfileCreationProxy {
    ILensHub immutable LENS_HUB;
    ILineaResolver immutable LINEA_RESOLVER;
//    address internal immutable LINEA_RESOLVER;

    constructor(ILensHub hub, ILineaResolver lineaResolver) {
        LENS_HUB = hub;
        LINEA_RESOLVER = lineaResolver;
    }

    function proxyCreateProfile(DataTypes.CreateProfileData memory vars) external {
        // (bool successLens, bytes memory dataLens) = 0x97F1d4aFE1A3D501731ca7993fE6E518F4FbcE76.call(abi.encodeWithSignature("balanceOf(address)", msg.sender));
        uint256  balanceLens = hub.balanceOf(msg.sender);
        require(balanceLens == 0, "Already has a Lens handle");

        // (bool successEns, bytes memory dataEns) = 0x117F113aEFb9AeD23d901C1fa02fDdaA1d20cCaB.call(abi.encodeWithSignature("balanceOf(address)", msg.sender));
        uint256 balanceEns = lineaResolver.balanceOf(msg.sender);
        require(balanceEns > 0, "Doesn't have an ENS token");

        uint256 handleLength = bytes(vars.handle).length;
        if (handleLength < 5) revert Errors.HandleLengthInvalid();

        bytes1 firstByte = bytes(vars.handle)[0];
        if (firstByte == '-' || firstByte == '_' || firstByte == '.')
            revert Errors.HandleFirstCharInvalid();

        for (uint256 i = 1; i < handleLength; ) {
            if (bytes(vars.handle)[i] == '.') revert Errors.HandleContainsInvalidCharacters();
            unchecked {
                ++i;
            }
        }

        vars.handle = string(abi.encodePacked(vars.handle, '.test'));
        LENS_HUB.createProfile(vars);
    }
}
