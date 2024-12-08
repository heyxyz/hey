import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedAccountTheme = async (): Promise<number> => {
  // Delete all accountTheme
  await prisma.accountTheme.deleteMany();

  // Seed accountTheme
  await prisma.accountTheme.createMany({
    data: [
      { accountAddress: TEST_LENS_ID, fontStyle: "bioRhyme" },
      { accountAddress: "0x0d", fontStyle: "bioRhyme" }
    ]
  });

  return 1;
};

export default seedAccountTheme;
