import { LENS_NETWORK } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import dotenv from 'dotenv';
import cron from 'node-cron';

import cleanClickhouse from './cleanClickhouse';
import cleanDraftPublications from './cleanDraftPublications';
import cleanEmailTokens from './cleanEmailTokens';
import cleanPreferences from './cleanPreferences';
import deletePublications from './deletePublications';
import replicateGardeners from './replicateGardeners';
import replicatePublications from './replicatePublications';

dotenv.config({ override: true });

const setupCron = () => {
  if (LENS_NETWORK !== 'mainnet') {
    return;
  }

  logger.info('Cron jobs are started...');

  cron.schedule('*/5 * * * *', async () => {
    await replicateGardeners();
  });

  cron.schedule('*/10 * * * * *', async () => {
    await deletePublications();
  });

  cron.schedule('*/1 * * * *', async () => {
    await replicatePublications();
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanClickhouse();
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanDraftPublications();
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanEmailTokens();
  });

  cron.schedule('*/5 * * * *', async () => {
    await cleanPreferences();
  });

  return;
};

export default setupCron;
