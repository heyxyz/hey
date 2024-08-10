import leafwatch from '@hey/db/prisma/leafwatch/client';
import logger from '@hey/helpers/logger';

const cleanLeafwatch = async () => {
  try {
    await leafwatch.event.deleteMany({
      where: { url: { not: { contains: 'hey.xyz' } } }
    });

    logger.info(
      '[Cron] cleanLeafwatch - Cleaned non hey.xyz events from Leafwatch'
    );
  } catch (error) {
    logger.error('[Cron] cleanLeafwatch - Error cleaning Leafwatch', error);
  }
};

export default cleanLeafwatch;
