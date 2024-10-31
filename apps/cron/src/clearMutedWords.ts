import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";

const clearMutedWords = async () => {
  try {
    await prisma.mutedWord.deleteMany({
      where: { expiresAt: { lte: new Date() } }
    });

    logger.info("[Cron] clearMutedWords - Cleaned up muted words");
  } catch (error) {
    logger.error("[Cron] clearMutedWords - Error clearing muted words", error);
  }
};

export default clearMutedWords;
