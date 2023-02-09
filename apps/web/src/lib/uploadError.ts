import axios from 'axios';
import { RAVEN_WORKER_URL } from 'data/constants';

const isBrowser = typeof window !== 'undefined';

const uploadError = (error: Error) => {
  if (isBrowser) {
    axios(RAVEN_WORKER_URL, {
      method: 'POST',
      data: {
        ddsource: 'error',
        status: 'error',
        error: { message: error.message, stack: error?.stack },
        url: location.href,
        sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      }
    }).catch(() => {
      console.error('Error while sending error to Datadog');
    });
  }
};

export default uploadError;
