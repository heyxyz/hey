/*
  Warnings:

  - Added the required column `amount` to the `Pro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latestTransactionHash` to the `Pro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pro" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "latestTransactionHash" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Pro_expiresAt_idx" ON "Pro"("expiresAt");
