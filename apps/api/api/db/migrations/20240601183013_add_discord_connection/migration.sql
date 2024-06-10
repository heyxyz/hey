-- CreateTable
CREATE TABLE "DiscordConnection" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscordConnection_pkey" PRIMARY KEY ("id")
);
