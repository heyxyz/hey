/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Preference_email_key" ON "Preference"("email");
