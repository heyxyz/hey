import type { FC } from 'react';

import { useVerifyQuery } from '@hey/lens';
import useLensAuthData from 'src/hooks/useLensAuthData';

const LensAuthProvider: FC = () => {
  const { id } = useLensAuthData();
  const lensAuthData = useLensAuthData();

  useVerifyQuery({
    pollInterval: 8000,
    skip: !id,
    variables: { request: { accessToken: lensAuthData['X-Access-Token'] } }
  });

  return null;
};

export default LensAuthProvider;
