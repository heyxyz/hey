/*
  Warnings:

  - Added the required column `creatorId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMember_profileId_idx" ON "GroupMember"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_profileId_key" ON "GroupMember"("groupId", "profileId");

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
