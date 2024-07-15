import logger from '@hey/helpers/logger';
import prisma from 'src/helpers/prisma';

const cleanDraftPublications = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  const { count } = await prisma.draftPublication.deleteMany({
    where: {
      updatedAt: { lt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    }
  });
  logger.info(
    `[Cron] cleanDraftPublications - Cleaned up ${count} draft publications that are older than 100 days`
  );
};

export default cleanDraftPublications;
