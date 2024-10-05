import prisma from "../client";

const seedTokens = async (): Promise<number> => {
  // Delete all allowedToken
  await prisma.allowedToken.deleteMany();

  // Seed allowedToken
  const allowedTokens = await prisma.allowedToken.createMany({
    data: [
      {
        contractAddress: "0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c",
        name: "Bonsai",
        symbol: "BONSAI",
        decimals: 18
      },
      {
        contractAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18
      }
    ]
  });

  return allowedTokens.count;
};

export default seedTokens;
