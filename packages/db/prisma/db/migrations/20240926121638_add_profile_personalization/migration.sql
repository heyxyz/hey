-- CreateTable
CREATE TABLE "ProfilePersonalization" (
    "id" TEXT NOT NULL,
    "overviewFontStyle" TEXT,
    "publicationFontStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePersonalization_pkey" PRIMARY KEY ("id")
);
