-- CreateTable
CREATE TABLE "ProfileTheme" (
    "id" TEXT NOT NULL,
    "overviewFontStyle" TEXT,
    "publicationFontStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileTheme_pkey" PRIMARY KEY ("id")
);
