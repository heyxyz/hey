import logger from '@hey/helpers/logger';

import heyPg from '../../src/db/heyPg';

const dbVacuum = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await heyPg.query('VACUUM FULL');
  logger.info('[Cron] dbVacuum - Vacuumed database');
};

export default dbVacuum;
