import prisma from "../client";

const seedPreferences = async (): Promise<number> => {
  const preferences = await prisma.preference.createMany({
    data: [{ id: "0x0d" }]
  });

  return preferences.count;
};

export default seedPreferences;
