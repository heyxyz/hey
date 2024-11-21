import prisma from "../client";
import seedAccountPermission from "./seedAccountPermission";
import seedAccountStatus from "./seedAccountStatus";
import seedAccountTheme from "./seedAccountTheme";
import seedEmails from "./seedEmails";
import seedLists from "./seedLists";
import seedListsAccounts from "./seedListsAccounts";
import seedPermissions from "./seedPermissions";
import seedPinnedList from "./seedPinnedList";
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

  const lists = await seedLists();
  console.log(`Seeded ${lists} lists`);

  const listsAccounts = await seedListsAccounts();
  console.log(`Seeded ${listsAccounts} list accounts`);

  const pinnedList = await seedPinnedList();
  console.log(`Seeded ${pinnedList} pinned list`);
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
