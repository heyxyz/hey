-- AlterTable
ALTER TABLE "Group" ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ProfileRestriction" (
    "id" TEXT NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileRestriction_isFlagged_isSuspended_idx" ON "ProfileRestriction"("isFlagged", "isSuspended");
