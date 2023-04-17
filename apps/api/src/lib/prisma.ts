import { PrismaClient } from '@prisma/client';

declare global {
  var __globalPrisma__: PrismaClient;
}

export let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({
    log: ['error', 'warn']
  });
} else {
  if (!global.__globalPrisma__) {
    global.__globalPrisma__ = new PrismaClient({
      log: ['error', 'warn']
    });
  }

  db = global.__globalPrisma__;
}
