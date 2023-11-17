import { Redis } from 'ioredis';

const createRedisClient = () => {
  return new Redis({
    port: 11416,
    host: 'viaduct.proxy.rlwy.net',
    username: 'default',
    password: process.env.REDIS_PASSWORD
  });
};

export default createRedisClient;
