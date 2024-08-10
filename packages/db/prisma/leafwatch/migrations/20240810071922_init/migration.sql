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
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impression" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publication" TEXT NOT NULL,
    "viewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("id")
);
