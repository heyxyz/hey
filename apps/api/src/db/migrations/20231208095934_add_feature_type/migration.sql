-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('FEATURE', 'KILL_SWITCH', 'PERMISSION', 'MODE');

-- DropIndex
DROP INDEX "Feature_key_priority_idx";

-- DropIndex
DROP INDEX "Group_slug_featured_idx";

-- DropIndex
DROP INDEX "StaffPick_type_score_idx";

-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "type" "FeatureType" NOT NULL DEFAULT 'FEATURE';

-- CreateIndex
CREATE INDEX "Feature_priority_idx" ON "Feature"("priority");

-- CreateIndex
CREATE INDEX "Feature_type_idx" ON "Feature"("type");

-- CreateIndex
CREATE INDEX "Group_slug_idx" ON "Group"("slug");

-- CreateIndex
CREATE INDEX "Group_featured_idx" ON "Group"("featured");

-- CreateIndex
CREATE INDEX "StaffPick_type_idx" ON "StaffPick"("type");

-- CreateIndex
CREATE INDEX "StaffPick_score_idx" ON "StaffPick"("score");
