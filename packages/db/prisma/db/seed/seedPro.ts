import { TEST_PRO_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedPro = async (): Promise<number> => {
  // Delete all pro
  await prisma.pro.deleteMany();

  // Seed pro
  await prisma.pro.create({
    data: {
      profileId: TEST_PRO_LENS_ID,
      amount: 13.16,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      transactionHash: "0x123"
    }
  });

  return 1;
};

export default seedPro;
