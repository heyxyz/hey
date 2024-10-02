/*
  Warnings:

  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DissmissedBanner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DissmissedBanner" DROP CONSTRAINT "DissmissedBanner_bannerId_fkey";

-- DropTable
DROP TABLE "Banner";

-- DropTable
DROP TABLE "DissmissedBanner";
