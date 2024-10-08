import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedProfileStatus = async (): Promise<number> => {
  // Delete all profileStatus
  await prisma.profileStatus.deleteMany();

  // Seed profileStatus
  await prisma.profileStatus.create({
    data: { id: TEST_LENS_ID, emoji: "😀", message: "Status message" }
  });

  return 1;
};

export default seedProfileStatus;
