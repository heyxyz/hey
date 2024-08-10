import { PrismaClient } from './generated/leafwatch.ts';

const leafwatchClientSingleton = () => {
  return new PrismaClient();
};

type LeafwatchClientSingleton = ReturnType<typeof leafwatchClientSingleton>;

const globalForLeafwatch = globalThis as unknown as {
  leafwatch: LeafwatchClientSingleton | undefined;
};

const leafwatch = globalForLeafwatch.leafwatch ?? leafwatchClientSingleton();

export default leafwatch;

if (process.env.NODE_ENV !== 'production') {
  globalForLeafwatch.leafwatch = leafwatch;
}
