import logger from '@hey/helpers/logger';

const cleanPreferences = () => {
  try {
    // await prisma.preference.deleteMany({
    //   where: { appIcon: 0, highSignalNotificationFilter: false }
    // });

    logger.info('[Cron] cleanPreferences - Cleaned up Preference');
  } catch (error) {
    logger.error('[Cron] cleanPreferences - Error cleaning preferences', error);
  }
};

export default cleanPreferences;
