import prisma from "../client";
import seedEmails from "./seedEmails";
import seedLists from "./seedLists";
import seedListsProfiles from "./seedListsProfiles";
import seedPermissions from "./seedPermissions";
import seedPinnedList from "./seedPinnedList";
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

  const lists = await seedLists();
  console.log(`Seeded ${lists} lists`);

  const listsProfiles = await seedListsProfiles();
  console.log(`Seeded ${listsProfiles} list profiles`);

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
