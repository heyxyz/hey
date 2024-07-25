import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';

const cleanDraftPublications = async () => {
  try {
    await heyPg.query('DELETE FROM "DraftPublication" WHERE "updatedAt" < $1', [
      new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
    ]);

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
