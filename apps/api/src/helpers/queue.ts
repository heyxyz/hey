import logger from '@hey/helpers/logger';
import Bull from 'bull';

const queue = new Bull('queue', process.env.REDIS_URL!, {
  redis: { maxRetriesPerRequest: null }
});

queue.on('active', (job) => {
  logger.info(`[Worker] Job active - ${job.name}`);
});

queue.on('completed', (job) => {
  logger.info(`[Worker] Job completed - ${job.name}`);
});

queue.on('failed', (job, error) => {
  logger.error(`[Worker] Job failed - ${job.name} - ${error}`);
});

queue.on('error', (error) => {
  console.error(`[Worker] Error - ${error}`);
});

const addToQueue = (jobName: string, data: any) => {
  queue.add(jobName, data, {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true
  });
};

export { addToQueue, queue };
