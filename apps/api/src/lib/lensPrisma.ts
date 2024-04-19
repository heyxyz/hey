import { PrismaClient } from 'src/db/generated/lens';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const lensPrisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default lensPrisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = lensPrisma;
}
