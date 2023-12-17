-- CreateTable
CREATE TABLE "ChatProfiles" (
    "chatPassword" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ChatProfiles_pkey" PRIMARY KEY ("profileId")
);

-- CreateIndex
CREATE INDEX "ChatProfiles_profileId_idx" ON "ChatProfiles"("profileId");
