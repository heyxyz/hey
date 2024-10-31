-- CreateTable
CREATE TABLE "MutedWord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutedWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MutedWord_profileId_idx" ON "MutedWord"("profileId");
