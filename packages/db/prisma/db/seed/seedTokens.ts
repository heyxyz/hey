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
      }
    ]
  });

  return allowedTokens.count;
};

export default seedTokens;
