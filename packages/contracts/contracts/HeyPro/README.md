# GoodPro

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/GoodPro/deploy.ts --network polygonAmoy
npx hardhat verify 0x8f5C228E4b9C4Ff01e84C0C4DBDdFe969F6Ca0Ed --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/GoodPro/deploy.ts --network polygon
npx hardhat verify 0xd95dA09bF6a60d9b66D23397FA55abE12F28D477 --network polygon
```

## Versions

- `GoodPro` - Initial version of the contract.

## Contracts

| Contract  | Amoy                                         | Mainnet                                      |
| --------- | -------------------------------------------- | -------------------------------------------- |
| `GoodPro` | `0x8f5C228E4b9C4Ff01e84C0C4DBDdFe969F6Ca0Ed` | `0xd95dA09bF6a60d9b66D23397FA55abE12F28D477` |
