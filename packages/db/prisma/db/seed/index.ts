import prisma from "../client";
import seedAccountPermission from "./seedAccountPermission";
import seedAccountStatus from "./seedAccountStatus";
import seedAccountTheme from "./seedAccountTheme";
import seedEmails from "./seedEmails";
import seedPermissions from "./seedPermissions";
import seedPreferences from "./seedPreferences";
import seedTokens from "./seedTokens";

async function main() {
  const preferences = await seedPreferences();
  console.log(`Seeded ${preferences} preferences`);

  const permissions = await seedPermissions();
  console.log(`Seeded ${permissions} permissions`);

  const accountPermission = await seedAccountPermission();
  console.log(`Seeded ${accountPermission} account permissions`);

  const tokens = await seedTokens();
  console.log(`Seeded ${tokens} tokens`);

  const accountStatus = await seedAccountStatus();
  console.log(`Seeded ${accountStatus} account status`);

  const accountTheme = await seedAccountTheme();
  console.log(`Seeded ${accountTheme} account theme`);

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
