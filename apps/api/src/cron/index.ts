import { LENS_NETWORK } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import * as Sentry from '@sentry/node';
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

const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);

const main = () => {
  if (LENS_NETWORK !== 'mainnet') {
    return;
  }

  logger.info('Cron jobs are started...');

  cronWithCheckIn.schedule(
    '*/5 * * * *',
    async () => {
      await replicateGardeners();
      return;
    },
    { name: 'replicateGardeners' }
  );

  cronWithCheckIn.schedule(
    '*/1  * * * *',
    async () => {
      await deleteLensPublications();
      return;
    },
    { name: 'deleteLensPublications' }
  );

  cronWithCheckIn.schedule(
    '*/2 * * * *',
    async () => {
      await replicateLensPublications();
      return;
    },
    { name: 'replicateLensPublications' }
  );

  cronWithCheckIn.schedule(
    '*/5 * * * *',
    async () => {
      await cleanClickhouse();
      return;
    },
    { name: 'cleanClickhouse' }
  );

  cronWithCheckIn.schedule(
    '*/5 * * * *',
    async () => {
      await cleanDraftPublications();
      return;
    },
    { name: 'cleanDraftPublications' }
  );

  cronWithCheckIn.schedule(
    '*/5 * * * *',
    async () => {
      await cleanEmailTokens();
      return;
    },
    { name: 'cleanEmailTokens' }
  );

  cronWithCheckIn.schedule(
    '*/5 * * * *',
    async () => {
      await cleanPreferences();
      return;
    },
    { name: 'cleanPreferences' }
  );
};

main();
