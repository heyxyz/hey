-- CreateTable
CREATE TABLE "TrustedProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustedProfile_pkey" PRIMARY KEY ("id")
);
