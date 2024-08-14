-- CreateTable
CREATE TABLE "DraftPublication" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "openActionModules" JSONB,
    "collectModule" JSONB,
    "attachments" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DraftPublication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DraftPublication_profileId_idx" ON "DraftPublication"("profileId");

-- CreateIndex
CREATE INDEX "DraftPublication_createdAt_updatedAt_idx" ON "DraftPublication"("createdAt", "updatedAt");
