/*
  Warnings:

  - The primary key for the `Pro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `latestTransactionHash` on the `Pro` table. All the data in the column will be lost.
  - The `id` column on the `Pro` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `profileId` to the `Pro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionHash` to the `Pro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pro" DROP CONSTRAINT "Pro_pkey",
DROP COLUMN "latestTransactionHash",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "transactionHash" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Pro_pkey" PRIMARY KEY ("id");
