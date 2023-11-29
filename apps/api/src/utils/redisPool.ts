import { IORedisPool, IORedisPoolOptions } from 'ts-ioredis-pool';

const ioRedisPoolOpts = IORedisPoolOptions.fromUrl(
  process.env.REDIS_URL as string
).withPoolOptions({
  min: 2,
  max: 20
});

export default new IORedisPool(ioRedisPoolOpts);
