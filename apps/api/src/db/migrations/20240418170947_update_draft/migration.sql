/*
  Warnings:

  - You are about to drop the column `attachments` on the `DraftPublication` table. All the data in the column will be lost.
  - You are about to drop the column `openActionModules` on the `DraftPublication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DraftPublication" DROP COLUMN "attachments",
DROP COLUMN "openActionModules";
