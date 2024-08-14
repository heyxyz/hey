/*
  Warnings:

  - You are about to drop the column `hash` on the `Pro` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `Pro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan` to the `Pro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeId` to the `Pro` table without a default value. This is not possible if the table is not empty.
  - Made the column `expiresAt` on table `Pro` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Pro_hash_idx";

-- AlterTable
ALTER TABLE "Pro" DROP COLUMN "hash",
ADD COLUMN     "plan" TEXT NOT NULL,
ADD COLUMN     "stripeId" TEXT NOT NULL,
ALTER COLUMN "expiresAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pro_stripeId_key" ON "Pro"("stripeId");

-- CreateIndex
CREATE INDEX "Pro_plan_idx" ON "Pro"("plan");
