-- CreateTable
CREATE TABLE "Poll" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pollId" UUID NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "optionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PollOption_pollId_idx" ON "PollOption"("pollId");

-- CreateIndex
CREATE INDEX "PollResponse_optionId_idx" ON "PollResponse"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "PollResponse_profileId_optionId_key" ON "PollResponse"("profileId", "optionId");

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD CONSTRAINT "PollResponse_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
