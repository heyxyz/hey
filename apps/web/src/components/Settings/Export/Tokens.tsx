import type { FC } from 'react';

import { Card, CardHeader } from '@hey/ui';
import toast from 'react-hot-toast';
import useLensAuthData from 'src/hooks/useLensAuthData';

const Tokens: FC = () => {
  const lensAuthData = useLensAuthData();

  return (
    <>
      <Card>
        <CardHeader title="Your temporary access token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(
              lensAuthData['X-Access-Token'] as string
            );
          }}
        >
          {lensAuthData['X-Access-Token']}
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary refresh token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(
              lensAuthData['X-Refresh-Token'] as string
            );
          }}
        >
          {lensAuthData['X-Refresh-Token']}
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary identity token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left text-sm font-bold dark:bg-gray-600"
          onClick={() => {
            toast.success('Copied to clipboard');
            navigator.clipboard.writeText(
              lensAuthData['X-Identity-Token'] as string
            );
          }}
        >
          {lensAuthData['X-Identity-Token']}
        </button>
      </Card>
    </>
  );
};

export default Tokens;
