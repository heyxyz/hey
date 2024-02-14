# Hey Contracts

- `HeyLensSignup.sol` - Contract for permissionless signup to Hey with Lens Protocol.

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Mumbai
npx hardhat run script/deploy.ts --network polygonMumbai
npx hardhat verify 0x6476d0E3eDd88BEc0d60b3D04079e1B124B13922 --network polygonMumbai

# Deploy to Polygon
npx hardhat run script/deploy.ts --network polygon
npx hardhat verify 0x11E6452982601F47bB2898c2761514CA73C26b48 --network polygon
```

## Contracts

| Contract        | Mainnet                                                                                                                         | Mumbai                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `HeyLensSignup` | [0x6476d0E3eDd88BEc0d60b3D04079e1B124B13922](https://mumbai.polygonscan.com/address/0x6476d0E3eDd88BEc0d60b3D04079e1B124B13922) | [0x11E6452982601F47bB2898c2761514CA73C26b48](https://polygonscan.com/address/0x11E6452982601F47bB2898c2761514CA73C26b48) |
