-- CreateTable
CREATE TABLE "GroupFavorite" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupFavorite_profileId_idx" ON "GroupFavorite"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupFavorite_groupId_profileId_key" ON "GroupFavorite"("groupId", "profileId");

-- AddForeignKey
ALTER TABLE "GroupFavorite" ADD CONSTRAINT "GroupFavorite_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
