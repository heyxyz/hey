import type { FC } from 'react';

import { Card, CardHeader, H6 } from '@hey/ui';
import toast from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const Tokens: FC = () => {
  const { accessToken, identityToken, refreshToken } = hydrateAuthTokens();

  return (
    <>
      <Card>
        <CardHeader title="Your temporary access token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(accessToken as string);
          }}
        >
          <H6>{accessToken}</H6>
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary refresh token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(refreshToken as string);
          }}
        >
          <H6>{refreshToken}</H6>
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary identity token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(identityToken as string);
          }}
        >
          <H6>{identityToken}</H6>
        </button>
      </Card>
    </>
  );
};

export default Tokens;
