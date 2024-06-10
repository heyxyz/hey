/*
  Warnings:

  - You are about to drop the column `type` on the `StaffPick` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StaffPick_type_idx";

-- AlterTable
ALTER TABLE "StaffPick" DROP COLUMN "type";

-- DropEnum
DROP TYPE "StaffPickType";
