import { exit } from "node:process";
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
    await setRedis("ping", "ping", generateForeverExpiry());
    logger.info("[Redis] Ping key set");
  } catch (error) {
    logger.error("Error deleting Redis keys", error);
  } finally {
    logger.info("[Redis] Keeping the connection open");
    exit(0);
  }
};

flushRedisKeys();
