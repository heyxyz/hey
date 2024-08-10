import prisma from '@hey/db/prisma/db/client';
import logger from '@hey/helpers/logger';

const cleanDraftPublications = async () => {
  try {
    await prisma.draftPublication.deleteMany({
      where: {
        updatedAt: { lt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
      }
    });

    logger.info(
      `[Cron] cleanDraftPublications - Cleaned up draft publications that are older than 100 days`
    );
  } catch (error) {
    logger.error(
      '[Cron] cleanDraftPublications - Error cleaning drafts',
      error
    );
  }
};

export default cleanDraftPublications;
