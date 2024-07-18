import logger from '@hey/helpers/logger';

const cleanPreferences = () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

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
