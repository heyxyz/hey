-- CreateTable
CREATE TABLE "Tip" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publicationId" TEXT NOT NULL,
    "fromProfileId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toProfileId" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);
