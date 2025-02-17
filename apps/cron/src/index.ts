import logger from "@hey/helpers/logger";
import cron from "node-cron";
import cleanPreferences from "./cleanPreferences";
import dbVacuum from "./dbVacuum";
import heartbeat from "./heartbeat";

const startCronJobs = () => {
  logger.info("Cron jobs are started...");

  cron.schedule("*/30 * * * * *", async () => {
    await heartbeat();
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
};

// Initialize cron jobs
startCronJobs();
