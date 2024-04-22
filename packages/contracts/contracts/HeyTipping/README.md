# HeyTipping

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyTipping/deploy.ts --network polygonAmoy
npx hardhat verify 0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyTipping/deploy.ts --network polygon
npx hardhat verify 0x94fD8D9d2DC6D937E7e78E3204Cb76cE732505Fa --network polygon
```

## Versions

- `HeyTipping` - Initial version of the contract.

## Contracts

| Contract     | Mainnet                                                                                                                      | Amoy                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `HeyTipping` | [0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF](https://www.oklink.com/amoy/address/0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF) | [0x69A31eA6Af50AcB3ea662e348F9F34b8517743dc](https://www.oklink.com/polygon/address/0x69A31eA6Af50AcB3ea662e348F9F34b8517743dc) |
