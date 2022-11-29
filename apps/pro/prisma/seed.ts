import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { userId: '0x0d' },
    create: {
      userId: '0x0d',
      proExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    },
    update: {
      proExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
