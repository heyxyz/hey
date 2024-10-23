/*
  Warnings:

  - You are about to drop the column `showOnHome` on the `List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "showOnHome",
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
