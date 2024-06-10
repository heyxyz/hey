-- CreateTable
CREATE TABLE "CachedProfileScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CachedProfileScore_pkey" PRIMARY KEY ("id")
);
