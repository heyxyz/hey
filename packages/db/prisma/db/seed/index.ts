import prisma from "../client";
import seedEmails from "./seedEmails";
import seedPermissions from "./seedPermissions";
import seedPreferences from "./seedPreferences";
import seedProfilePermission from "./seedProfilePermission";
import seedProfileStatus from "./seedProfileStatus";
import seedProfileTheme from "./seedProfileTheme";
import seedTokens from "./seedTokens";

async function main() {
  const preferences = await seedPreferences();
  console.log(`Seeded ${preferences} preferences`);

  const permissions = await seedPermissions();
  console.log(`Seeded ${permissions} permissions`);

  const profilePermissions = await seedProfilePermission();
  console.log(`Seeded ${profilePermissions} profile permissions`);

  const tokens = await seedTokens();
  console.log(`Seeded ${tokens} tokens`);

  const profileStatus = await seedProfileStatus();
  console.log(`Seeded ${profileStatus} profile status`);

  const profileTheme = await seedProfileTheme();
  console.log(`Seeded ${profileTheme} profile theme`);

  const emails = await seedEmails();
  console.log(`Seeded ${emails} emails`);
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
