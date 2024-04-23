# HeyPro

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyPro/deploy.ts --network polygonAmoy
npx hardhat verify 0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyPro/deploy.ts --network polygon
npx hardhat verify 0x69A31eA6Af50AcB3ea662e348F9F34b8517743dc --network polygon
```

## Versions

- `HeyPro` - Initial version of the contract.

## Contracts

| Contract | Mainnet                                                                                                                         | Amoy                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `HeyPro` | [0x69A31eA6Af50AcB3ea662e348F9F34b8517743dc](https://polygonscan.com/address/0x69A31eA6Af50AcB3ea662e348F9F34b8517743dc) | [0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF](https://amoy.polygonscan.com/amoy/address/0x6024Af3AA67C8f95f4A60fAdA33a1cC4c36927FF) |
