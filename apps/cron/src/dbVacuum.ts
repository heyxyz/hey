import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";

const dbVacuum = async () => {
  try {
    await prisma.$queryRaw`VACUUM FULL`;
    logger.info("[Cron] dbVacuum - Vacuumed database");
  } catch (error) {
    logger.error("[Cron] dbVacuum - Error vacuuming database", error);
  }
};

export default dbVacuum;
