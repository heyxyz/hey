import logger from '@hey/helpers/logger';
import prisma from 'src/helpers/prisma';

const cleanPreferences = async () => {
  await prisma.preference.deleteMany({
    where: { appIcon: 0, highSignalNotificationFilter: false }
  });
  logger.info('Cron: Cleaned up Preference');
};

export default cleanPreferences;
