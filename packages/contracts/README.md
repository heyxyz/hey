# Hey Contracts

- `HeyLensSignup.sol` - Contract for permissionless signup to Hey with Lens Protocol.

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Mumbai
npx hardhat run script/deploy.ts --network polygonMumbai
npx hardhat verify 0x6d131f44fBB08D463D18394Ada64BE59519339e3 --network polygonMumbai

# Deploy to Polygon
npx hardhat run script/deploy.ts --network polygon
npx hardhat verify 0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53 --network polygon
```

## Upgrade Contracts

```sh
# Upgrade on Mumbai
npx hardhat run script/upgrade.ts --network polygonMumbai

# Upgrade on Polygon
npx hardhat run script/upgrade.ts --network polygon
npx hardhat verify 0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53 --network polygon
```

## Versions

- `HeyLensSignupV2` - Add direct transfer of funds to the owner and remove `withdrawFunds` function.
- `HeyLensSignup` - Initial version of the contract.

## Contracts

| Contract        | Mainnet                                                                                                                         | Mumbai                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `HeyLensSignup` | [0x6d131f44fBB08D463D18394Ada64BE59519339e3](https://mumbai.polygonscan.com/address/0x6d131f44fBB08D463D18394Ada64BE59519339e3) | [0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53](https://polygonscan.com/address/0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53) |
