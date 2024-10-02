-- CreateTable
CREATE TABLE "Banner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DissmissedBanner" (
    "profileId" TEXT NOT NULL,
    "bannerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DissmissedBanner_pkey" PRIMARY KEY ("profileId","bannerId")
);

-- CreateIndex
CREATE INDEX "DissmissedBanner_profileId_bannerId_idx" ON "DissmissedBanner"("profileId", "bannerId");

-- AddForeignKey
ALTER TABLE "DissmissedBanner" ADD CONSTRAINT "DissmissedBanner_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
