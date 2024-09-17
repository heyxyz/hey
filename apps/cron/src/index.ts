import logger from "@hey/helpers/logger";
import cron from "node-cron";

import backupEventsToS3 from "./backupEventsToS3";
import backupImpressionsToS3 from "./backupImpressionsToS3";
import batchProcessEvents from "./batchProcessEvents";
import batchProcessImpressions from "./batchProcessImpressions";
import cleanClickhouse from "./cleanClickhouse";
import cleanEmailTokens from "./cleanEmailTokens";
import cleanPreferences from "./cleanPreferences";
import dbVacuum from "./dbVacuum";
import heartbeat from "./heartbeat";
import syncGardenersToGitLabFeatureFlag from "./syncGardenersToGitLabFeatureFlag";
import truncate4EverlandBucket from "./truncate4EverlandBucket";

const startCronJobs = () => {
  logger.info("Cron jobs are started...");

  cron.schedule("*/30 * * * * *", async () => {
    await heartbeat();
    return;
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanClickhouse();
    return;
  });

  cron.schedule("0 0 * * *", async () => {
    await truncate4EverlandBucket();
    return;
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanEmailTokens();
    return;
  });

  cron.schedule("*/5 * * * *", async () => {
    await cleanPreferences();
    return;
  });

  cron.schedule("0 */6 * * *", async () => {
    await dbVacuum();
    return;
  });

  cron.schedule("*/10 * * * *", async () => {
    await batchProcessEvents();
    return;
  });

  cron.schedule("*/1 * * * *", async () => {
    await batchProcessImpressions();
    return;
  });

  cron.schedule("*/5 * * * *", async () => {
    await backupEventsToS3();
    return;
  });

  cron.schedule("*/5 * * * *", async () => {
    await backupImpressionsToS3();
    return;
  });

  cron.schedule("*/60 * * * *", async () => {
    await syncGardenersToGitLabFeatureFlag();
    return;
  });
};

// Initialize cron jobs
startCronJobs();
