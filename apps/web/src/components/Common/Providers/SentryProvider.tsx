import type { FC } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

const SentryProvider: FC = () => {
  const { id } = getCurrentSession();

  useEffect(() => {
    if (id) {
      Sentry.setUser({ id });
    }
  }, [id]);

  return null;
};

export default SentryProvider;
