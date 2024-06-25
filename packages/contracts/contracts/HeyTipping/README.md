# HeyTipping

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyTipping/deploy.ts --network polygonAmoy
npx hardhat verify 0xAadeC94DCD26555F464455d309a5E896f78cC65f --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyTipping/deploy.ts --network polygon
npx hardhat verify 0xCFeB907551c3C7E4Df2627B2Ed3D0C782702785B --network polygon
```

## Versions

- `HeyTipping` - Initial version of the contract.

## Contracts

| Contract     | Amoy                                         | Mainnet                                      |
| ------------ | -------------------------------------------- | -------------------------------------------- |
| `HeyTipping` | `0xAadeC94DCD26555F464455d309a5E896f78cC65f` | `0xCFeB907551c3C7E4Df2627B2Ed3D0C782702785B` |
