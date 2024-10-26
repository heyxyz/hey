import { LENS_MEDIA_SNAPSHOT_URL, TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

export const HEY_TEAM_ID = "0c34a529-8db6-40b8-9b35-7f474f7d509a";
export const LENS_TEAM_ID = "bd59a480-37d8-4e55-8706-a277a44dff8a";

const seedLists = async (): Promise<number> => {
  // Delete all lists
  await prisma.list.deleteMany();

  // Seed lists
  const lists = await prisma.list.createMany({
    data: [
      {
        id: HEY_TEAM_ID,
        name: "Hey Team",
        description: "The team behind Hey",
        avatar: `${LENS_MEDIA_SNAPSHOT_URL}/5cffa71e6bb1c1a9bf829a10fae9b52d41dee8b7883dc7ba08271aabfdeaf488.png`,
        createdBy: "0x0d"
      },
      {
        id: LENS_TEAM_ID,
        name: "Lens Team",
        description: "The team behind Lens",
        avatar: `${LENS_MEDIA_SNAPSHOT_URL}/bd59a48037d84e558706a277a44dff8ac277629ab12804b1b19be9df254e036c.png`,
        createdBy: "0x0d"
      },
      {
        name: "Test List",
        description: "Test List",
        avatar: `${LENS_MEDIA_SNAPSHOT_URL}/5cffa71e6bb1c1a9bf829a10fae9b52d41dee8b7883dc7ba08271aabfdeaf488.png`,
        createdBy: "0x0d"
      },
      {
        name: "Test List 2",
        description: "Test List 2",
        avatar: `${LENS_MEDIA_SNAPSHOT_URL}/5cffa71e6bb1c1a9bf829a10fae9b52d41dee8b7883dc7ba08271aabfdeaf488.png`,
        createdBy: TEST_LENS_ID
      }
    ]
  });

  return lists.count;
};

export default seedLists;
