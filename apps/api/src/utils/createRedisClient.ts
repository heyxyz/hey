import { Redis } from 'ioredis';

const createRedisClient = () => {
  return new Redis(process.env.REDIS_URL!, {
    family: 6
  });
};

export default createRedisClient;
