/*
  Warnings:

  - Added the required column `address` to the `PrivateKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrivateKey" ADD COLUMN     "address" TEXT NOT NULL;
