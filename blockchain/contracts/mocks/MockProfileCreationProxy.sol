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
 * There are two restrictions: The user must not have a Lens handle and  must have ENS Line registration
 */
contract MockProfileCreationProxy {
    ILensHub immutable LENS_HUB;
    ILineaResolver immutable LINEA_RESOLVER;

    constructor(ILensHub hub, ILineaResolver lineaResolver) {
        LENS_HUB = hub;
        LINEA_RESOLVER = lineaResolver;
    }

    function proxyCreateProfile(DataTypes.CreateProfileData memory vars) external {
        require(tx.origin == msg.sender, 'The transaction sender must be the same as the transaction origin');

        uint256 balanceLens = LENS_HUB.balanceOf(msg.sender);
        require(balanceLens == 0, 'Already has a Lens handle');

        uint256 balanceEns = LINEA_RESOLVER.balanceOf(msg.sender);
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
