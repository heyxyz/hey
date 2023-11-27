/*
  Warnings:

  - You are about to drop the column `description` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Feature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "description",
DROP COLUMN "name";
