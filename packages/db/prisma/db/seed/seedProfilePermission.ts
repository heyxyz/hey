import { TEST_LENS_ID, TEST_SUSPENDED_LENS_ID } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "../client";

const seedProfilePermission = async (): Promise<number> => {
  // Delete all profile permissions
  await prisma.profilePermission.deleteMany();

  // Seed profile permissions
  const profilePermissions = await prisma.profilePermission.createMany({
    data: [
      { permissionId: PermissionId.Verified, profileId: TEST_LENS_ID },
      { permissionId: PermissionId.StaffPick, profileId: TEST_LENS_ID },
      {
        permissionId: PermissionId.Suspended,
        profileId: TEST_SUSPENDED_LENS_ID
      }
    ]
  });

  return profilePermissions.count;
};

export default seedProfilePermission;
