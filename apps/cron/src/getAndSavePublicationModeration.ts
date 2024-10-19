import lensPg from "@hey/db/lensPg";
import { generateForeverExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";

const getAndSavePublicationModeration = async () => {
  try {
    const offsetKey = "ai:moderation-offset";
    let offset: any = await getRedis(offsetKey);
    offset = offset ? Number.parseInt(offset) : 0;
    logger.info(`[Cron] getAndSavePublicationModeration - Offset: ${offset}`);

    const publications = await lensPg.query(
      `
        SELECT publication_id
        FROM publication.metadata
        WHERE is_encrypted = false
        AND hide_from_feed = false
        AND content IS NOT NULL
        ORDER BY timestamp ASC
        LIMIT 35
        OFFSET $1;
      `,
      [offset]
    );

    if (publications.length > 0) {
      const axiosPromises = publications.map((pub: any) => {
        return fetch("https://api.hey.xyz/ai/internal/moderation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: pub.publication_id })
        });
      });

      const promiseResponse = await Promise.all(axiosPromises);
      offset += publications.length;
      await setRedis(offsetKey, offset.toString(), generateForeverExpiry());

      logger.info(
        `[Cron] getAndSavePublicationModeration - Processed ${promiseResponse.length} / ${publications.length} publications`
      );
    } else {
      logger.info(
        "[Cron] getAndSavePublicationModeration - No publications to process"
      );
    }
  } catch (error) {
    console.log(error);
    logger.error(
      "[Cron] getAndSavePublicationModeration - Error processing publications",
      error
    );
  }
};

export default getAndSavePublicationModeration;
