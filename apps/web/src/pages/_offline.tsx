import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { RefreshIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';

const Offline: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`Offline • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Oops, You are offline!</Trans>
        </h1>
        <div className="mb-4">
          <Trans>Check your internet connection and try again</Trans>
        </div>
        <Button
          className="item-center mx-auto flex"
          size="lg"
          icon={<RefreshIcon className="h-4 w-4" />}
          onClick={() => location.reload()}
        >
          <Trans>Retry</Trans>
        </Button>
      </div>
    </div>
  );
};

export default Offline;
