import logger from "@hey/helpers/logger";
import dotenv from "dotenv";
import getAndSavePublicationModeration from "./getAndSavePublicationModeration";

dotenv.config({ override: true });

const startJobs = async () => {
  logger.info("Jobs are started...");

  while (true) {
    try {
      await getAndSavePublicationModeration();
    } catch (error) {
      logger.error("Error during jobs:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

// Initialize jobs
startJobs();
