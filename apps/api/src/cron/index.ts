import logger from '@good/helpers/logger';
import dotenv from 'dotenv';
import cron from 'node-cron';

import cleanClickhouse from './cleanClickhouse';
import cleanDraftPublications from './cleanDraftPublications';
import cleanEmailTokens from './cleanEmailTokens';
import cleanPreferences from './cleanPreferences';
import deleteLensPublications from './deleteLensPublications';
import replicateGardeners from './replicateGardeners';
import replicateLensPublications from './replicateLensPublications';

dotenv.config({ override: true });

const main = () => {
  logger.info('Cron jobs are started...');

  cron.schedule('*/5 * * * *', async () => {
    await replicateGardeners();
    return;
  });

  cron.schedule('*/1  * * * *', async () => {
    await deleteLensPublications();
    return;
  });

  cron.schedule('*/2 * * * *', async () => {
    await replicateLensPublications();
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
};

main();
