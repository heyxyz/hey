import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';

const cleanPreferences = async () => {
  try {
    await heyPg.query(
      'DELETE FROM "Preference" WHERE "appIcon" = 0 AND "highSignalNotificationFilter" = false'
    );

    logger.info('[Cron] cleanPreferences - Cleaned up Preference');
  } catch (error) {
    logger.error('[Cron] cleanPreferences - Error cleaning preferences', error);
  }
};

export default cleanPreferences;
