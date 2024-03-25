import { IS_MAINNET } from '@hey/data/constants';

import { prisma } from '../seed';

const seedAllowedTokens = async (): Promise<number> => {
  const allowedTokens = await prisma.allowedToken.createMany({
    data: [
      {
        contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        createdAt: new Date('2023-12-03 07:32:14.92'),
        decimals: 6,
        name: 'Tether USD',
        symbol: 'USDT'
      },
      {
        contractAddress: IS_MAINNET
          ? '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
          : '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
        createdAt: new Date('2023-12-03 07:33:27.293'),
        decimals: 18,
        name: 'DAI Stablecoin',
        symbol: 'DAI'
      },
      {
        contractAddress: '0x9b8cc6320f22325759b7d2ca5cd27347bb4ecd86',
        createdAt: new Date('2024-02-12 13:45:28.937'),
        decimals: 18,
        name: 'Pointless',
        symbol: 'pointless'
      },
      {
        contractAddress: IS_MAINNET
          ? '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
          : '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
        createdAt: new Date('2023-12-03 07:31:55.117'),
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC'
      },
      {
        contractAddress: IS_MAINNET
          ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
          : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        createdAt: new Date('2024-10-03 07:30:03.438'),
        decimals: 18,
        name: 'Wrapped Matic',
        symbol: 'WMATIC'
      },
      {
        contractAddress: IS_MAINNET
          ? '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
          : '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        createdAt: new Date('2023-12-03 07:34:34.354'),
        decimals: 18,
        name: 'Wrapped Ether',
        symbol: 'WETH'
      }
    ]
  });

  return allowedTokens.count;
};

export default seedAllowedTokens;
