-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('PERMISSION', 'COHORT');

-- CreateTable
CREATE TABLE "Preference" (
    "accountAddress" TEXT NOT NULL,
    "appIcon" INTEGER DEFAULT 0,
    "includeLowScore" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "type" "PermissionType" NOT NULL DEFAULT 'PERMISSION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPermission" (
    "accountAddress" TEXT NOT NULL,
    "permissionId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountPermission_pkey" PRIMARY KEY ("accountAddress","permissionId")
);

-- CreateTable
CREATE TABLE "VerificationOperationCount" (
    "id" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationOperationCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "Permission_type_idx" ON "Permission"("type");

-- CreateIndex
CREATE INDEX "AccountPermission_accountAddress_idx" ON "AccountPermission"("accountAddress");

-- CreateIndex
CREATE INDEX "AccountPermission_permissionId_idx" ON "AccountPermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationOperationCount_operation_key" ON "VerificationOperationCount"("operation");

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
