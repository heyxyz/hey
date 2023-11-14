import { Card } from '@hey/ui';
import type { FC } from 'react';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';

const Tokens: FC = () => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  return (
    <>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          Your temporary access token
        </div>
        <div className="break-words rounded-md bg-gray-300 px-1.5 py-0.5 text-sm font-bold dark:bg-gray-600">
          {accessToken}
        </div>
      </Card>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          Your temporary refresh token
        </div>
        <div className="break-words rounded-md bg-gray-300 px-1.5 py-0.5 text-sm font-bold dark:bg-gray-600">
          {refreshToken}
        </div>
      </Card>
    </>
  );
};

export default Tokens;
