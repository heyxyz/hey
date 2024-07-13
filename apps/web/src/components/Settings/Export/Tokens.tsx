import type { FC } from 'react';

import { Card, CardHeader } from '@hey/ui';
import toast from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const Tokens: FC = () => {
  const { accessToken, identityToken, refreshToken } = hydrateAuthTokens();

  return (
    <>
      <Card>
        <CardHeader title="Your temporary access token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(accessToken as string);
          }}
        >
          {accessToken}
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary refresh token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(refreshToken as string);
          }}
        >
          {refreshToken}
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary identity token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(identityToken as string);
          }}
        >
          {identityToken}
        </button>
      </Card>
    </>
  );
};

export default Tokens;
