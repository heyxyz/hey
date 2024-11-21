import { TEST_LENS_ID, TEST_SUSPENDED_LENS_ID } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "../client";

const seedAccountPermission = async (): Promise<number> => {
  // Delete all profile permissions
  await prisma.profilePermission.deleteMany();

  // Seed profile permissions
  const accountPermissions = await prisma.profilePermission.createMany({
    data: [
      { permissionId: PermissionId.Verified, profileId: TEST_LENS_ID },
      { permissionId: PermissionId.StaffPick, profileId: TEST_LENS_ID },
      {
        permissionId: PermissionId.Suspended,
        profileId: TEST_SUSPENDED_LENS_ID
      }
    ]
  });

  return accountPermissions.count;
};

export default seedAccountPermission;
