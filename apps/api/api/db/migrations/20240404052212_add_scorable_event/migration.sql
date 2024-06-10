-- CreateTable
CREATE TABLE "ScorableEvent" (
    "eventType" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "ScorableEvent_pkey" PRIMARY KEY ("eventType")
);
