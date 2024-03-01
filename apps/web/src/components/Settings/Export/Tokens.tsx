import type { FC } from 'react';

import { Card } from '@hey/ui';
import toast from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const Tokens: FC = () => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  return (
    <>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          Your temporary access token
        </div>
        <button
          className="cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(accessToken as string);
          }}
        >
          {accessToken}
        </button>
      </Card>
      <Card className="space-y-2 p-5">
        <div className="pb-1 text-lg font-bold">
          Your temporary refresh token
        </div>
        <button
          className="cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(refreshToken as string);
          }}
        >
          {refreshToken}
        </button>
      </Card>
    </>
  );
};

export default Tokens;
