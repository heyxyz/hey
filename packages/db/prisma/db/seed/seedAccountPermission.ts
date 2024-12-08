import { TEST_LENS_ID, TEST_SUSPENDED_LENS_ID } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "../client";

const seedAccountPermission = async (): Promise<number> => {
  // Delete all profile permissions
  await prisma.accountPermission.deleteMany();

  // Seed profile permissions
  const accountPermissions = await prisma.accountPermission.createMany({
    data: [
      { permissionId: PermissionId.Verified, accountAddress: TEST_LENS_ID },
      { permissionId: PermissionId.StaffPick, accountAddress: TEST_LENS_ID },
      {
        permissionId: PermissionId.Suspended,
        accountAddress: TEST_SUSPENDED_LENS_ID
      }
    ]
  });

  return accountPermissions.count;
};

export default seedAccountPermission;
