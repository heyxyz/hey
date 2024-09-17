import type { RedisClientType } from "redis";

import hoursToSeconds from "@hey/helpers/hoursToSeconds";
import logger from "@hey/helpers/logger";
import randomNumber from "@hey/helpers/randomNumber";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({ override: true });

const noRedisError = () => logger.error("[Redis] Redis client not initialized");

let redisClient: null | RedisClientType = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on("connect", () => logger.info("[Redis] Redis connect"));
  redisClient.on("ready", () => logger.info("[Redis] Redis ready"));
  redisClient.on("reconnecting", (err) =>
    logger.error("[Redis] Redis reconnecting", err)
  );
  redisClient.on("error", (err) => logger.error("[Redis] Redis error", err));
  redisClient.on("end", (err) => logger.error("[Redis] Redis end", err));

  const connectRedis = async () => {
    logger.info("[Redis] Connecting to Redis");
    await redisClient!.connect();
  };

  connectRedis().catch((error) =>
    logger.error("[Redis] Connection error", error)
  );
} else {
  logger.info("[Redis] REDIS_URL not set");
}

// Generates a random expiry time between 1 and 3 hours
export const generateMediumExpiry = (): number => {
  return randomNumber(hoursToSeconds(1), hoursToSeconds(3));
};

// Generates a random expiry time between 4 and 8 hours
export const generateLongExpiry = (): number => {
  return randomNumber(hoursToSeconds(4), hoursToSeconds(8));
};

// Generates a random expiry time between 9 and 24 hours
const generateExtraLongExpiry = (): number => {
  return randomNumber(hoursToSeconds(9), hoursToSeconds(24));
};

export const generateForeverExpiry = (): number => {
  return hoursToSeconds(5000000);
};

export const setRedis = async (
  key: string,
  value: boolean | number | Record<string, any> | string,
  expiry = generateExtraLongExpiry()
) => {
  if (!redisClient) {
    noRedisError();
    return;
  }

  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }

  return await redisClient.set(key, value, { EX: expiry });
};

export const getRedis = async (key: string) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }
  return await redisClient.get(key);
};

export const delRedis = async (key: string) => {
  if (!redisClient) {
    noRedisError();
    return;
  }
  await redisClient.del(key);
};

export const getTtlRedis = async (key: string) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }
  return await redisClient.ttl(key);
};

export const rPushRedis = async (key: string, value: string) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }
  return await redisClient.rPush(key, value);
};

export const lRangeRedis = async (key: string, start: number, stop: number) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }
  return await redisClient.lRange(key, start, stop);
};

export const lTrimRedis = async (key: string, start: number, stop: number) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }
  return await redisClient.lTrim(key, start, stop);
};

export default redisClient;
