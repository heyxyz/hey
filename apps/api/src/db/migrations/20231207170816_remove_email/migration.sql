/*
  Warnings:

  - You are about to drop the column `email` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `marketingOptIn` on the `Preference` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Preference_email_key";

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "email",
DROP COLUMN "marketingOptIn";
