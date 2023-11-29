import { IORedisPool, IORedisPoolOptions } from 'ts-ioredis-pool';

const ioRedisPoolOpts = IORedisPoolOptions.fromUrl(
  process.env.REDIS_URL as string
)
  .withIORedisOptions({ family: 0 })
  .withPoolOptions({
    min: 2,
    max: 20
  });

export default new IORedisPool(ioRedisPoolOpts);
