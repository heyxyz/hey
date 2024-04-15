# Hey Contracts

- `HeyLensSignup.sol` - Contract for permissionless signup to Hey with Lens Protocol.

# HeyLensSignup

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyLensSignup/deploy.ts --network polygonAmoy
npx hardhat verify 0x82Bcb5DA51c6F3D0Ce942bDBEbb0B8A7774d62e8 --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyLensSignup/deploy.ts --network polygon
npx hardhat verify 0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53 --network polygon
```

## Upgrade Contracts

```sh
# Upgrade on Amoy
npx hardhat run script/HeyLensSignup/upgrade.ts --network polygonAmoy

# Upgrade on Polygon
npx hardhat run script/HeyLensSignup/upgrade.ts --network polygon
npx hardhat verify 0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53 --network polygon
```

## Versions

- `HeyLensSignupV2` - Add direct transfer of funds to the owner and remove `withdrawFunds` function.
- `HeyLensSignup` - Initial version of the contract.

## Contracts

| Contract        | Mainnet                                                                                                                      | Amoy                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `HeyLensSignup` | [0x82Bcb5DA51c6F3D0Ce942bDBEbb0B8A7774d62e8](https://www.oklink.com/amoy/address/0x82bcb5da51c6f3d0ce942bdbebb0b8a7774d62e8) | [0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53](https://www.oklink.com/polygon/address/0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53) |

# HeyPro

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyPro/deploy.ts --network polygonAmoy
npx hardhat verify 0x093F9ddED8a0E18d7d4483cf9902aA46628F4fb8 --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyPro/deploy.ts --network polygon
npx hardhat verify 0xDc05E91D378B9a09D0FFcD6Aa611Be9521e964c2 --network polygon
```

## Versions

- `HeyPro` - Initial version of the contract.

## Contracts

| Contract | Mainnet                                                                                                                      | Amoy                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `HeyPro` | [0x093F9ddED8a0E18d7d4483cf9902aA46628F4fb8](https://www.oklink.com/amoy/address/0x093F9ddED8a0E18d7d4483cf9902aA46628F4fb8) | [0xDc05E91D378B9a09D0FFcD6Aa611Be9521e964c2](https://www.oklink.com/polygon/address/0xDc05E91D378B9a09D0FFcD6Aa611Be9521e964c2) |
