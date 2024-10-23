/*
  Warnings:

  - Added the required column `createdBy` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "createdBy" TEXT NOT NULL;
