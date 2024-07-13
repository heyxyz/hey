import type { FC } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
import { useVerifyQuery } from '@hey/lens';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const LensAuthProvider: FC = () => {
  const { id } = getCurrentSession();
  const { accessToken } = hydrateAuthTokens();

  useVerifyQuery({
    pollInterval: 8000,
    skip: !id,
    variables: { request: { accessToken } }
  });

  return null;
};

export default LensAuthProvider;
