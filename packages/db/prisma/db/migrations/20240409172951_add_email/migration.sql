-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Email_verificationToken_key" ON "Email"("verificationToken");
