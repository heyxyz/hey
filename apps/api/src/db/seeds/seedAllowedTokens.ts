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
        contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        createdAt: new Date('2023-12-03 07:33:27.293'),
        decimals: 18,
        name: 'DAI Stablecoin',
        symbol: 'DAI'
      },
      {
        contractAddress: '0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c',
        createdAt: new Date('2024-02-12 13:45:28.937'),
        decimals: 18,
        maxTipAmount: 1000,
        name: 'Bonsai',
        symbol: 'BONSAI'
      },
      {
        contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        createdAt: new Date('2023-12-03 07:31:55.117'),
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC'
      },
      {
        contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        createdAt: new Date('2024-10-03 07:30:03.438'),
        decimals: 18,
        name: 'Wrapped Matic',
        symbol: 'WMATIC'
      },
      {
        contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
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
