import { CookiesKeys, cookieStorage } from '@hey/data/storage';
import { Card } from '@hey/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const Tokens: FC = () => {
  const accessToken = cookieStorage.getItem(CookiesKeys.AccessToken);
  const refreshToken = cookieStorage.getItem(CookiesKeys.RefreshToken);

  return (
    <>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          <Trans>Your temporary access token</Trans>
        </div>
        <div className="break-words rounded-md bg-gray-300 px-1.5 py-0.5 text-sm font-bold dark:bg-gray-600">
          {accessToken}
        </div>
      </Card>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          <Trans>Your temporary refresh token</Trans>
        </div>
        <div className="break-words rounded-md bg-gray-300 px-1.5 py-0.5 text-sm font-bold dark:bg-gray-600">
          {refreshToken}
        </div>
      </Card>
    </>
  );
};

export default Tokens;
