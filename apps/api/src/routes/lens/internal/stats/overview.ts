import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const result = await lensPg.multi(
        `
          SELECT reltuples::BIGINT AS authenticationsCount
          FROM pg_class
          WHERE relname = 'authentication_record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tracking');

          SELECT reltuples::BIGINT AS relayUsageCount
          FROM pg_class
          WHERE relname = 'usage' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'relay');

          SELECT reltuples::BIGINT AS postsCount
          FROM pg_class
          WHERE relname = 'record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'publication');

          SELECT reltuples::BIGINT AS profilesCount
          FROM pg_class
          WHERE relname = 'record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'profile');

          SELECT reltuples::BIGINT AS bookmarkedPostsCount
          FROM pg_class
          WHERE relname = 'bookmarked_publication' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'personalisation');

          SELECT reltuples::BIGINT AS notInterestedPostsCount
          FROM pg_class
          WHERE relname = 'not_interested_publication' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'personalisation');

          SELECT reltuples::BIGINT AS wtfRecommendationDismissedCount
          FROM pg_class
          WHERE relname = 'wtf_recommendation_dismissed' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'personalisation');

          SELECT reltuples::BIGINT AS notificationsCount
          FROM pg_class
          WHERE relname = 'record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'notification');

          SELECT total_count::BIGINT as momokaCount
          FROM momoka.stats;

          SELECT reltuples::BIGINT AS mediaSnapshotsCount
          FROM pg_class
          WHERE relname = 'snapshot_mapping' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'media');

          SELECT reltuples::BIGINT AS qualityProfilesCount
          FROM pg_class
          WHERE relname = 'quality_profiles' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'machine_learning');

          SELECT reltuples::BIGINT AS indexedTransactionsCount
          FROM pg_class
          WHERE relname = 'indexed_transaction' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'indexer');

          SELECT reltuples::BIGINT AS hashtagsCount
          FROM pg_class
          WHERE relname = 'hashtag' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'global_stats');

          SELECT reltuples::BIGINT AS mentionsCount
          FROM pg_class
          WHERE relname = 'mention' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'global_stats');

          SELECT reltuples::BIGINT AS ensCount
          FROM pg_class
          WHERE relname = 'address_reverse_record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'ens');

          SELECT reltuples::BIGINT AS gardenerReportsCount
          FROM pg_class
          WHERE relname = 'gardener_profile_record' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'custom_filters');
        `
      );

      const flatObject = result.reduce((acc: any, item) => {
        const innerItem = item[0];
        const key = Object.keys(innerItem)[0];
        const value = innerItem[key];
        acc[key] = value;
        return acc;
      }, {});

      logger.info("[Lens] Fetched overview stats");

      return res.status(200).json({ result: flatObject, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
