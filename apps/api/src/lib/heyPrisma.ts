import { PrismaClient } from 'src/db/generated/hey';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const heyPrisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default heyPrisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = heyPrisma;
}
