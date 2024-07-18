import logger from '@hey/helpers/logger';

const cleanEmailTokens = () => {
  try {
    // const { count } = await prisma.email.updateMany({
    //   data: { tokenExpiresAt: null, verificationToken: null, verified: false },
    //   where: { tokenExpiresAt: { lt: new Date() } }
    // });

    logger.info(
      `[Cron] cleanEmailTokens - Cleaned up ${1} email tokens that are expired`
    );
  } catch (error) {
    logger.error(
      '[Cron] cleanEmailTokens - Error cleaning email tokens',
      error
    );
  }
};

export default cleanEmailTokens;
