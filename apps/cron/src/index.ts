import logger from '@hey/helpers/logger';
import cron from 'node-cron';

import batchProcessEvents from './batchProcessEvents';
import batchProcessImpressions from './batchProcessImpressions';
import cleanClickhouse from './cleanClickhouse';
import cleanDraftPublications from './cleanDraftPublications';
import cleanEmailTokens from './cleanEmailTokens';
import cleanPreferences from './cleanPreferences';
import dbVacuum from './dbVacuum';
import heartbeat from './heartbeat';

const startCronJobs = () => {
  logger.info('Cron jobs are started...');

  cron.schedule('*/30 * * * * *', async () => {
    await heartbeat();
    return;
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanClickhouse();
    return;
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanDraftPublications();
    return;
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanEmailTokens();
    return;
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanPreferences();
    return;
  });

  cron.schedule('0 */6 * * *', async () => {
    await dbVacuum();
    return;
  });

  cron.schedule('*/10 * * * *', async () => {
    await batchProcessEvents();
    return;
  });

  cron.schedule('*/1 * * * *', async () => {
    await batchProcessImpressions();
    return;
  });
};

// Initialize cron jobs
startCronJobs();
