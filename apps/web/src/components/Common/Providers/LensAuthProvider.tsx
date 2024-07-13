import type { FC } from 'react';

import { useVerifyQuery } from '@hey/lens';
import useLensAuthData from 'src/hooks/useLensAuthData';

const LensAuthProvider: FC = () => {
  const { id } = useLensAuthData();
  const lensAuthData = useLensAuthData();
  const accessToken = lensAuthData.headers['X-Access-Token'];

  useVerifyQuery({
    pollInterval: 8000,
    skip: !id,
    variables: { request: { accessToken } }
  });

  return null;
};

export default LensAuthProvider;
