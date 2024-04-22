# HeyTipping

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyTipping/deploy.ts --network polygonAmoy
npx hardhat verify 0xF56BEA166561D3dC30e594efae23E0BB8B65188e --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyTipping/deploy.ts --network polygon
npx hardhat verify 0x94fD8D9d2DC6D937E7e78E3204Cb76cE732505Fa --network polygon
```

## Versions

- `HeyTipping` - Initial version of the contract.

## Contracts

| Contract     | Mainnet                                                                                                                      | Amoy                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `HeyTipping` | [0x94fD8D9d2DC6D937E7e78E3204Cb76cE732505Fa](https://www.oklink.com/amoy/address/0x94fD8D9d2DC6D937E7e78E3204Cb76cE732505Fa) | [0xF56BEA166561D3dC30e594efae23E0BB8B65188e](https://www.oklink.com/polygon/address/0xF56BEA166561D3dC30e594efae23E0BB8B65188e) |
