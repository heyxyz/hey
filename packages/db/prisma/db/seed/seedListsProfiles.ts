import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";
import { HEY_TEAM_ID, LENS_TEAM_ID } from "./seedLists";

const seedListsProfiles = async (): Promise<number> => {
  // Delete all lists profiles
  await prisma.listProfile.deleteMany();

  // Seed list profiles
  const listProfiles = await prisma.listProfile.createMany({
    data: [
      { listId: HEY_TEAM_ID, profileId: "0x0d" },
      { listId: HEY_TEAM_ID, profileId: "0x2d" },
      { listId: HEY_TEAM_ID, profileId: "0x3d" },
      { listId: HEY_TEAM_ID, profileId: TEST_LENS_ID },
      { listId: LENS_TEAM_ID, profileId: TEST_LENS_ID }
    ]
  });

  return listProfiles.count;
};

export default seedListsProfiles;
