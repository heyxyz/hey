-- CreateTable
CREATE TABLE "ProfileStatus" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileStatus_pkey" PRIMARY KEY ("id")
);
