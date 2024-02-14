# Hey Contracts

- `HeyLensSignup.sol` - Contract for permissionless signup to Hey with Lens Protocol.

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Mumbai
npx hardhat run script/deploy.ts --network polygonMumbai
npx hardhat verify 0x58e3E478e6581ca443650d2969354701CC6C53b8 --network polygonMumbai

# Deploy to Polygon
npx hardhat run script/deploy.ts --network polygon
npx hardhat verify 0x11E6452982601F47bB2898c2761514CA73C26b48 --network polygon
```

## Contracts

| Contract        | Mainnet                                                                                                                         | Mumbai                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `HeyLensSignup` | [0x58e3E478e6581ca443650d2969354701CC6C53b8](https://mumbai.polygonscan.com/address/0x58e3E478e6581ca443650d2969354701CC6C53b8) | [0x11E6452982601F47bB2898c2761514CA73C26b48](https://mumbai.polygonscan.com/address/0x11E6452982601F47bB2898c2761514CA73C26b48) |
