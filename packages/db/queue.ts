import Queue from "bull";

const REDIS_URL = process.env.REDIS_URL;

export const emailQueue = () => {
  if (!REDIS_URL) {
    return new Queue("email-queue");
  }

  return new Queue("email-queue", REDIS_URL, {});
};
