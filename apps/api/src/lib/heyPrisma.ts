import { PrismaClient as HeyPrismaClient } from 'src/db/generated/hey';

const heyPrismaClientSingleton = (): HeyPrismaClient => {
  return new HeyPrismaClient();
};

type HeyPrismaClientSingleton = ReturnType<typeof heyPrismaClientSingleton>;

const globalForHeyPrisma = globalThis as any;

if (!globalForHeyPrisma.heyPrisma) {
  globalForHeyPrisma.heyPrisma = heyPrismaClientSingleton();
}

const heyPrisma: HeyPrismaClientSingleton = globalForHeyPrisma?.heyPrisma;

export default heyPrisma;
