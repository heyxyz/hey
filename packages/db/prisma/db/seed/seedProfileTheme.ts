import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedProfileTheme = async (): Promise<number> => {
  // Delete all profileTheme
  await prisma.profileTheme.deleteMany();

  // Seed profileTheme
  await prisma.profileTheme.createMany({
    data: [
      { id: TEST_LENS_ID, fontStyle: "bioRhyme" },
      { id: "0x0d", fontStyle: "bioRhyme" }
    ]
  });

  return 1;
};

export default seedProfileTheme;
