-- CreateTable
CREATE TABLE "ProfilePersonalization" (
    "id" TEXT NOT NULL,
    "overviewFontStyle" TEXT NOT NULL,
    "publicationFontStyle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePersonalization_pkey" PRIMARY KEY ("id")
);
