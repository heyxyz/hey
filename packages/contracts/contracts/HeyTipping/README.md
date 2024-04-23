# HeyTipping

Try running some of the following tasks:

```sh
npx hardhat compile

# Deploy to Amoy
npx hardhat run script/HeyTipping/deploy.ts --network polygonAmoy
npx hardhat verify 0xAadeC94DCD26555F464455d309a5E896f78cC65f --network polygonAmoy

# Deploy to Polygon
npx hardhat run script/HeyTipping/deploy.ts --network polygon
npx hardhat verify 0xeaa840189D8266A7452e8003ab06110E0027079d --network polygon
```

## Versions

- `HeyTipping` - Initial version of the contract.

## Contracts

| Contract     | Mainnet                                                                                                                         | Amoy                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `HeyTipping` | [0xeaa840189D8266A7452e8003ab06110E0027079d](https://www.oklink.com/polygon/address/0xeaa840189D8266A7452e8003ab06110E0027079d) | [0xAadeC94DCD26555F464455d309a5E896f78cC65f](https://www.oklink.com/amoy/address/0xAadeC94DCD26555F464455d309a5E896f78cC65f) |
