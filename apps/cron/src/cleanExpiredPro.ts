import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";

const cleanExpiredPro = async () => {
  try {
    await prisma.pro.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    logger.info("[Cron] cleanExpiredPro - Cleaned up expired pro");
  } catch (error) {
    logger.error("[Cron] cleanExpiredPro - Error cleaning expired pro", error);
  }
};

export default cleanExpiredPro;
