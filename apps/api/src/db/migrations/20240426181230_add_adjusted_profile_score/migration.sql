-- CreateTable
CREATE TABLE "AdjustedProfileScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdjustedProfileScore_pkey" PRIMARY KEY ("id")
);
