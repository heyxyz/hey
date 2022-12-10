import axios from 'axios';
import { IS_PRODUCTION } from 'data/constants';
import { v4 as uuid } from 'uuid';

const enabled = process.env.NEXT_PUBLIC_DATADOG_TOKEN && IS_PRODUCTION;
const isBrowser = typeof window !== 'undefined';

const uploadError = (error: Error) => {
  if (isBrowser && enabled) {
    const reqId = uuid();
    console.log('Error request id:', reqId);
    axios('https://http-intake.logs.datadoghq.eu/api/v2/logs', {
      method: 'POST',
      params: {
        'dd-api-key': process.env.NEXT_PUBLIC_DATADOG_TOKEN,
        'dd-request-id': reqId
      },
      data: {
        ddsource: 'browser',
        status: 'error',
        error: error.toString(),
        url: location.href,
        sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      }
    })
      .then(() => reqId)
      .catch(() => {
        console.error('Error while sending error to Datadog');
      });
  }
};

export default uploadError;
