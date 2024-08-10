/*
  Warnings:

  - The primary key for the `AdjustedProfileScore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AdjustedProfileScore` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `profileId` to the `AdjustedProfileScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdjustedProfileScore" DROP CONSTRAINT "AdjustedProfileScore_pkey",
ADD COLUMN     "profileId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "AdjustedProfileScore_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "AdjustedProfileScore_profileId_idx" ON "AdjustedProfileScore"("profileId");

-- CreateIndex
CREATE INDEX "AdjustedProfileScore_createdAt_idx" ON "AdjustedProfileScore"("createdAt");
