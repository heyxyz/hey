import { PrismaClient as LensPrismaClient } from 'src/db/generated/lens';

const lensPrismaClientSingleton = (): LensPrismaClient => {
  return new LensPrismaClient();
};

type LensPrismaClientSingleton = ReturnType<typeof lensPrismaClientSingleton>;

const globalForLensPrisma = globalThis as any;

if (!globalForLensPrisma.lensPrisma) {
  globalForLensPrisma.lensPrisma = lensPrismaClientSingleton();
}

const lensPrisma: LensPrismaClientSingleton = globalForLensPrisma?.lensPrisma;

export default lensPrisma;
