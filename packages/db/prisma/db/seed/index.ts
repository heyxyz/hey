import prisma from "../client";
import seedPreferences from "./seedPreferences";

async function main() {
  const preferences = await seedPreferences();
  console.log(`Seeded ${preferences} preferences`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
