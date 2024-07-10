import hoursToSeconds from '@hey/helpers/hoursToSeconds';
import logger from '@hey/helpers/logger';
import randomNumber from '@hey/helpers/randomNumber';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('connect', () => logger.info('[Redis] Redis connect'));
redisClient.on('ready', () => logger.info('[Redis] Redis ready'));
redisClient.on('reconnecting', (err) =>
  logger.error('[Redis] Redis reconnecting', err)
);
redisClient.on('error', (err) => logger.error('[Redis] Redis error', err));
redisClient.on('end', (err) => logger.error('[Redis] Redis end', err));

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.info('[Redis] REDIS_URL not set');
    return;
  }

  logger.info('[Redis] Connecting to Redis');
  await redisClient.connect();
};

connectRedis().catch((error) =>
  logger.error('[Redis] Connection error', error)
);

const generateExtraLongExpiry = (): number => {
  return randomNumber(hoursToSeconds(9), hoursToSeconds(24));
};

export const setRedis = async (
  key: string,
  value: boolean | number | Record<string, any> | string
) => {
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }

  return await redisClient.set(key, value, { EX: generateExtraLongExpiry() });
};

export const getRedis = async (key: string) => {
  return await redisClient.get(key);
};

export const delRedis = async (key: string) => {
  await redisClient.del(key);
};

export default redisClient;
