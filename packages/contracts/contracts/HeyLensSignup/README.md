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
npx hardhat verify 0x82Bcb5DA51c6F3D0Ce942bDBEbb0B8A7774d62e8 --network polygonAmoy

# Upgrade on Polygon
npx hardhat run script/HeyLensSignup/upgrade.ts --network polygon
npx hardhat verify 0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53 --network polygon
```

## Versions

- `HeyLensSignupV2` - Add direct transfer of funds to the owner and remove `withdrawFunds` function.
- `HeyLensSignup` - Initial version of the contract.

## Contracts

| Contract        | Amoy                                         | Mainnet                                      |
| --------------- | -------------------------------------------- | -------------------------------------------- |
| `HeyLensSignup` | `0x82Bcb5DA51c6F3D0Ce942bDBEbb0B8A7774d62e8` | `0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53` |
