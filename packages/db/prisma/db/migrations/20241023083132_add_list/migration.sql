-- DropIndex
DROP INDEX "ProfilePermission_profileId_permissionId_idx";

-- CreateTable
CREATE TABLE "List" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListProfile" (
    "profileId" TEXT NOT NULL,
    "listId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListProfile_pkey" PRIMARY KEY ("profileId","listId")
);

-- CreateIndex
CREATE INDEX "ListProfile_listId_idx" ON "ListProfile"("listId");

-- CreateIndex
CREATE INDEX "ProfilePermission_profileId_idx" ON "ProfilePermission"("profileId");

-- CreateIndex
CREATE INDEX "ProfilePermission_permissionId_idx" ON "ProfilePermission"("permissionId");

-- AddForeignKey
ALTER TABLE "ListProfile" ADD CONSTRAINT "ListProfile_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
