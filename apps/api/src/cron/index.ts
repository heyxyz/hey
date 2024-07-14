import logger from '@hey/helpers/logger';
import dotenv from 'dotenv';
import cron from 'node-cron';

import cleanClickhouse from './cleanClickhouse';
import cleanDraftPublications from './cleanDraftPublications';
import cleanEmailTokens from './cleanEmailTokens';
import cleanPreferences from './cleanPreferences';
import dbVacuum from './dbVacuum';
import heartbeat from './heartbeat';

dotenv.config({ override: true });

const main = () => {
  logger.info('Cron jobs are started...');

  cron.schedule('*/30 * * * *', async () => {
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
};

main();
