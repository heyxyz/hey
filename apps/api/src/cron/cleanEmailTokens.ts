import logger from '@hey/helpers/logger';
import prisma from 'src/helpers/prisma';

const cleanEmailTokens = async () => {
  const { count } = await prisma.email.updateMany({
    data: { tokenExpiresAt: null, verificationToken: null, verified: false },
    where: { tokenExpiresAt: { lt: new Date() } }
  });
  logger.info(`Cron: Cleaned up ${count} email tokens that are expired`);
};

export default cleanEmailTokens;
