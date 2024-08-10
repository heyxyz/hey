/*
  Warnings:

  - The primary key for the `AdjustedProfileScore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AdjustedProfileScore` table. All the data in the column will be lost.
  - Made the column `reason` on table `AdjustedProfileScore` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AdjustedProfileScore" DROP CONSTRAINT "AdjustedProfileScore_pkey",
DROP COLUMN "id",
ALTER COLUMN "reason" SET NOT NULL,
ADD CONSTRAINT "AdjustedProfileScore_pkey" PRIMARY KEY ("profileId", "reason");
