import logger from '@hey/helpers/logger';
import prisma from 'src/helpers/prisma';

const cleanEmptyScores = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await prisma.cachedProfileScore.deleteMany({
    where: { score: 0 }
  });
  logger.info('Cron: cleanEmptyScores - Cleaned up empty scores');
};

export default cleanEmptyScores;
