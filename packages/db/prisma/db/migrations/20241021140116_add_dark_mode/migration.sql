/*
  Warnings:

  - You are about to drop the column `buttonBorderRadius` on the `ProfileTheme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileTheme" DROP COLUMN "buttonBorderRadius",
ADD COLUMN     "darkMode" BOOLEAN NOT NULL DEFAULT false;
