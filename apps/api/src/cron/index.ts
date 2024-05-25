import dotenv from 'dotenv';
import cron from 'node-cron';

import deletePublications from './deletePublications';
import replicateGardeners from './replicateGardeners';
import replicatePublications from './replicatePublications';

dotenv.config({ override: true });

cron.schedule('*/5 * * * *', async () => {
  await replicateGardeners();
});

cron.schedule('*/10 * * * * *', async () => {
  await replicatePublications();
});

cron.schedule('*/10 * * * * *', async () => {
  await deletePublications();
});
