import prisma from "@hey/db/prisma/db/client";
import { delRedisBulk } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";

const cleanExpiredPro = async () => {
  try {
    const data = await prisma.pro.findMany({
      where: { expiresAt: { lt: new Date() } },
      select: { id: true }
    });

    if (data.length === 0) {
      logger.info("[Cron] cleanExpiredPro - No expired pro profiles found");
      return;
    }

    const ids = data.map((item) => item.id);
    await prisma.pro.deleteMany({ where: { id: { in: ids } } });

    const redisKeys = data.map((item) => `profile:${item.id}`);
    await delRedisBulk(redisKeys);

    logger.info(
      `[Cron] cleanExpiredPro - Cleaned up ${data.length} expired pro profiles`
    );
  } catch (error) {
    logger.error(
      "[Cron] cleanExpiredPro - Error cleaning expired pro profiles",
      error
    );
  }
};

export default cleanExpiredPro;
