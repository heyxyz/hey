/*
  Warnings:

  - You are about to drop the column `score` on the `StaffPick` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StaffPick_score_idx";

-- AlterTable
ALTER TABLE "StaffPick" DROP COLUMN "score";
