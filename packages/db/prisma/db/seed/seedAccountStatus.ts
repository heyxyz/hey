import prisma from "../client";

const seedAccountStatus = async (): Promise<number> => {
  // Delete all accountStatus
  await prisma.accountStatus.deleteMany();

  // Seed accountStatus
  await prisma.accountStatus.create({
    data: {
      accountAddress: TEST_LENS_ID,
      emoji: "😀",
      message: "Status message"
    }
  });

  return 1;
};

export default seedAccountStatus;
