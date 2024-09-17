import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";

const cleanEmailTokens = async () => {
  try {
    await prisma.email.updateMany({
      data: { tokenExpiresAt: null, verificationToken: null, verified: false },
      where: { tokenExpiresAt: { lt: new Date() } }
    });

    logger.info(
      "[Cron] cleanEmailTokens - Cleaned up email tokens that are expired"
    );
  } catch (error) {
    logger.error(
      "[Cron] cleanEmailTokens - Error cleaning email tokens",
      error
    );
  }
};

export default cleanEmailTokens;
