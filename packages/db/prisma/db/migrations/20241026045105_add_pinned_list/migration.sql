/*
  Warnings:

  - You are about to drop the column `pinned` on the `List` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ListProfile_listId_idx";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "pinned";

-- CreateTable
CREATE TABLE "PinnedList" (
    "profileId" TEXT NOT NULL,
    "listId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedList_pkey" PRIMARY KEY ("profileId","listId")
);

-- AddForeignKey
ALTER TABLE "PinnedList" ADD CONSTRAINT "PinnedList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
