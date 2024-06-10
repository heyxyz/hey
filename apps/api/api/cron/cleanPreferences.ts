import logger from '@good/helpers/logger';
import prisma from 'api/helpers/prisma';

const cleanPreferences = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await prisma.preference.deleteMany({
    where: { appIcon: 0, highSignalNotificationFilter: false }
  });
  logger.info('Cron: cleanPreferences - Cleaned up Preference');
};

export default cleanPreferences;
