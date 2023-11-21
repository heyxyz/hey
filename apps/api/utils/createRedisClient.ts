import { Redis } from 'ioredis';

const createRedisClient = () => {
  return new Redis(process.env.REDIS_URL!);
};

export default createRedisClient;
