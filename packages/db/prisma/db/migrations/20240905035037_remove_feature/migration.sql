/*
  Warnings:

  - The values [STATUS,MODE] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `enabled` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionType_new" AS ENUM ('PERMISSION', 'COHORT');
ALTER TABLE "Permission" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Permission" ALTER COLUMN "type" TYPE "PermissionType_new" USING ("type"::text::"PermissionType_new");
ALTER TYPE "PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "PermissionType_old";
ALTER TABLE "Permission" ALTER COLUMN "type" SET DEFAULT 'PERMISSION';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProfileFeature" DROP CONSTRAINT "ProfileFeature_featureId_fkey";

-- DropIndex
DROP INDEX "Permission_priority_idx";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "enabled",
DROP COLUMN "priority";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "ProfileFeature";

-- DropEnum
DROP TYPE "FeatureType";
