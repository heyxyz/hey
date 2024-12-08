-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('PERMISSION', 'COHORT');

-- CreateTable
CREATE TABLE "Preference" (
    "accountAddress" TEXT NOT NULL,
    "appIcon" INTEGER DEFAULT 0,
    "highSignalNotificationFilter" BOOLEAN NOT NULL DEFAULT false,
    "developerMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "Email" (
    "accountAddress" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "MembershipNft" (
    "accountAddress" TEXT NOT NULL,
    "dismissedOrMinted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipNft_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "option" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "pollId" UUID NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountAddress" TEXT NOT NULL,
    "optionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "contractAddress" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedToken_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "AccountStatus" (
    "accountAddress" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountStatus_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "AccountTheme" (
    "accountAddress" TEXT NOT NULL,
    "fontStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountTheme_pkey" PRIMARY KEY ("accountAddress")
);

-- CreateTable
CREATE TABLE "MutedWord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountAddress" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutedWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Email_verificationToken_key" ON "Email"("verificationToken");

-- CreateIndex
CREATE INDEX "PollOption_pollId_idx" ON "PollOption"("pollId");

-- CreateIndex
CREATE INDEX "PollResponse_optionId_idx" ON "PollResponse"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "PollResponse_accountAddress_optionId_key" ON "PollResponse"("accountAddress", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedToken_contractAddress_key" ON "AllowedToken"("contractAddress");

-- CreateIndex
CREATE INDEX "AllowedToken_priority_idx" ON "AllowedToken"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "Permission_type_idx" ON "Permission"("type");

-- CreateIndex
CREATE INDEX "AccountPermission_accountAddress_idx" ON "AccountPermission"("accountAddress");

-- CreateIndex
CREATE INDEX "AccountPermission_permissionId_idx" ON "AccountPermission"("permissionId");

-- CreateIndex
CREATE INDEX "MutedWord_accountAddress_idx" ON "MutedWord"("accountAddress");

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD CONSTRAINT "PollResponse_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
