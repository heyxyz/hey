import prisma from "../client";

const seedPreferences = async (): Promise<number> => {
  // Delete all preferences
  await prisma.preference.deleteMany();

  // Seed preferences
  const preferences = await prisma.preference.createMany({
    data: [{ id: "0x0d" }]
  });

  return preferences.count;
};

export default seedPreferences;
