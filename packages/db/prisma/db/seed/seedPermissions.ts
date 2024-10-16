import { Permission, PermissionId } from "@hey/data/permissions";
import prisma from "../client";

const seedPermissions = async (): Promise<number> => {
  // Delete all permissions
  await prisma.permission.deleteMany();

  // Seed permissions
  const permissions = await prisma.permission.createMany({
    data: [
      { id: PermissionId.CommentSuspended, key: Permission.CommentSuspended },
      { id: PermissionId.Suspended, key: Permission.Suspended },
      { id: PermissionId.SuspendWarning, key: Permission.SuspendWarning },
      { id: PermissionId.Verified, key: Permission.Verified },
      { id: PermissionId.StaffPick, key: Permission.StaffPick },
      { id: PermissionId.Beta, key: Permission.Beta }
    ]
  });

  return permissions.count;
};

export default seedPermissions;
