import prisma from "../client";

const seedPreferences = async (): Promise<number> => {
  // Delete all preferences
  await prisma.preference.deleteMany();

  // Seed preferences
  const preferences = await prisma.preference.createMany({
    data: [{ accountAddress: TEST_LENS_ID }]
  });

  return preferences.count;
};

export default seedPreferences;
