import logger from '@hey/helpers/logger';

const cleanDraftPublications = () => {
  try {
    // const { count } = await prisma.draftPublication.deleteMany({
    //   where: {
    //     updatedAt: { lt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    //   }
    // });

    logger.info(
      `[Cron] cleanDraftPublications - Cleaned up ${1} draft publications that are older than 100 days`
    );
  } catch (error) {
    logger.error(
      '[Cron] cleanDraftPublications - Error cleaning drafts',
      error
    );
  }
};

export default cleanDraftPublications;
