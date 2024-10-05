import { exit } from "node:process";

import {
  TEST_LENS_ID,
  TEST_PRO_LENS_ID,
  TEST_SUSPENDED_LENS_ID
} from "@hey/data/constants";
import logger from "@hey/helpers/logger";
import redisClient, { generateForeverExpiry, setRedis } from "./redisClient";

const flushRedisKeys = async () => {
  if (!redisClient) {
    logger.error("Redis client not initialized");
    return;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info("[Redis] Successfully connected to Redis");
    }

    await redisClient.flushAll();
    logger.info("All Redis keys have been deleted");
    const authId = "1fdbabe5-9beb-41e9-b0ea-a5ae8f662653";
    await Promise.all([
      setRedis("ping", "pong", generateForeverExpiry()),
      setRedis(`auth:${TEST_LENS_ID}`, authId, generateForeverExpiry()),
      setRedis(`auth:${TEST_PRO_LENS_ID}`, authId, generateForeverExpiry()),
      setRedis(
        `auth:${TEST_SUSPENDED_LENS_ID}`,
        authId,
        generateForeverExpiry()
      )
    ]);
    logger.info("[Redis] Necessary keys have been set");
  } catch (error) {
    logger.error("Error deleting Redis keys", error);
  } finally {
    logger.info("[Redis] Keeping the connection open");
    exit(0);
  }
};

flushRedisKeys();
