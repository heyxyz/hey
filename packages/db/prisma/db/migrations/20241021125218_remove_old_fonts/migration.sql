/*
  Warnings:

  - You are about to drop the column `overviewFontStyle` on the `ProfileTheme` table. All the data in the column will be lost.
  - You are about to drop the column `publicationFontStyle` on the `ProfileTheme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileTheme" DROP COLUMN "overviewFontStyle",
DROP COLUMN "publicationFontStyle";
