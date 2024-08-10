import leafwatch from '@hey/db/prisma/leafwatch/client';
import logger from '@hey/helpers/logger';

const cleanClickhouse = async () => {
  try {
    await leafwatch.event.deleteMany({
      where: { url: { not: { contains: 'hey.xyz' } } }
    });

    logger.info(
      '[Cron] cleanClickhouse - Cleaned non hey.xyz events from Clickhouse'
    );
  } catch (error) {
    logger.error('[Cron] cleanClickhouse - Error cleaning Clickhouse', error);
  }
};

export default cleanClickhouse;
