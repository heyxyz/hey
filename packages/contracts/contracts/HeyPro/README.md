# HeyPro

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyPro/deploy.ts --network polygonAmoy
npx hardhat verify 0x8f5C228E4b9C4Ff01e84C0C4DBDdFe969F6Ca0Ed --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyPro/deploy.ts --network polygon
npx hardhat verify 0x4D5b616163387fA1Eb26bd1e84bd61C6fdA18C3a --network polygon
```

## Versions

- `HeyPro` - Initial version of the contract.

## Contracts

| Contract | Amoy                                         | Mainnet                                      |
|----------|----------------------------------------------|----------------------------------------------|
| `HeyPro` | `0x8f5C228E4b9C4Ff01e84C0C4DBDdFe969F6Ca0Ed` | `0x4D5b616163387fA1Eb26bd1e84bd61C6fdA18C3a` |
