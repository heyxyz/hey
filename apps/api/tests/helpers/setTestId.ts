import { setRedis } from "@hey/db/redisClient";

const setTestId = async (key: string): Promise<void> => {
  await setRedis(key, "true");
};

export default setTestId;
