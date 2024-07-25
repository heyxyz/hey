import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';

const cleanEmailTokens = async () => {
  try {
    await heyPg.query(
      'UPDATE "Email" SET "tokenExpiresAt" = NULL, "verificationToken" = NULL, "verified" = false WHERE "tokenExpiresAt" < $1',
      [new Date()]
    );

    logger.info(
      `[Cron] cleanEmailTokens - Cleaned up email tokens that are expired`
    );
  } catch (error) {
    logger.error(
      '[Cron] cleanEmailTokens - Error cleaning email tokens',
      error
    );
  }
};

export default cleanEmailTokens;
