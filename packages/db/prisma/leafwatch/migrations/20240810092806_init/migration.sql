-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor" TEXT,
    "fingerprint" TEXT,
    "name" TEXT NOT NULL,
    "properties" JSONB,
    "referrer" TEXT,
    "url" TEXT,
    "browser" TEXT,
    "ip" TEXT,
    "city" TEXT,
    "country" TEXT,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("created","id")
);

-- CreateTable
CREATE TABLE "Impression" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publication" TEXT NOT NULL,
    "viewed" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("viewed","id")
);

-- CreateIndex
CREATE INDEX "Event_created_idx" ON "Event"("created");

-- CreateIndex
CREATE INDEX "Impression_viewed_idx" ON "Impression"("viewed");
