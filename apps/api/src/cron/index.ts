import cron from 'node-cron';

cron.schedule('*/2 * * * * *', () => {
  console.log('Running a task every 2 seconds');
});
