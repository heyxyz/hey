import logger from '@hey/helpers/logger';
import prisma from 'src/helpers/prisma';

const cleanEmailTokens = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  const { count } = await prisma.email.updateMany({
    data: { tokenExpiresAt: null, verificationToken: null, verified: false },
    where: { tokenExpiresAt: { lt: new Date() } }
  });
  logger.info(
    `[Cron] cleanEmailTokens - Cleaned up ${count} email tokens that are expired`
  );
};

export default cleanEmailTokens;
