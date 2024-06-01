import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const Connect: FC = () => {
  const { accessToken } = hydrateAuthTokens();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          window.open(
            `${HEY_API_URL}/connections/github?accessToken=${accessToken}`,
            '_blank'
          );
        }}
      >
        GitHub
      </Button>
      <Button
        onClick={() => {
          window.open(
            `${HEY_API_URL}/connections/discord?accessToken=${accessToken}`,
            '_blank'
          );
        }}
      >
        Discord
      </Button>
      <Button
        onClick={() => {
          window.open(
            `${HEY_API_URL}/connections/x?accessToken=${accessToken}`,
            '_blank'
          );
        }}
      >
        X
      </Button>
    </div>
  );
};

export default Connect;
