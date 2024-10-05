import { delRedis, getRedis } from "@hey/db/redisClient";

const waitForTestCompletion = (key: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(async () => {
      const status = await getRedis(key);
      if (status === "true") {
        clearInterval(interval);
        delRedis(key);
        resolve();
      }
    }, 100);
  });
};

export default waitForTestCompletion;
