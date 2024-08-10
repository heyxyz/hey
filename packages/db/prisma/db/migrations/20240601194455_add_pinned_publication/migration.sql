-- CreateTable
CREATE TABLE "PinnedPublication" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedPublication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PinnedPublication_publicationId_idx" ON "PinnedPublication"("publicationId");
