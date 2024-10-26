import prisma from "../client";
import { HEY_TEAM_ID, LENS_TEAM_ID } from "./seedLists";

const seedPinnedList = async (): Promise<number> => {
  // Delete all pinned lists
  await prisma.pinnedList.deleteMany();

  // Seed pinned list
  const pinnedList = await prisma.pinnedList.createMany({
    data: [
      { listId: HEY_TEAM_ID, profileId: "0x0d" },
      { listId: LENS_TEAM_ID, profileId: "0x0d" }
    ]
  });

  return pinnedList.count;
};

export default seedPinnedList;
