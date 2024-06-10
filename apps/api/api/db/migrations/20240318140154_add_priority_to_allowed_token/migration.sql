-- AlterTable
ALTER TABLE "AllowedToken" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "AllowedToken_priority_idx" ON "AllowedToken"("priority");
