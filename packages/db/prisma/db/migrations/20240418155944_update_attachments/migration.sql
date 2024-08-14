/*
  Warnings:

  - The `attachments` column on the `DraftPublication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DraftPublication" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB;
