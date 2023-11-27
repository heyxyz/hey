/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "endedAt",
ADD COLUMN     "endsAt" TIMESTAMP(3);
