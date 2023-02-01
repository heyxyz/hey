import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { HomeIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';

const Custom500: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Looks like something went wrong!</Trans>
        </h1>
        <div className="lt-text-gray-500 mb-4">
          <Trans>
            We track these errors automatically, but if the problem persists feel free to contact us. In the
            meantime, try refreshing.
          </Trans>
        </div>
        <Link href="/">
          <Button className="item-center mx-auto flex" size="lg" icon={<HomeIcon className="h-4 w-4" />}>
            <Trans>Go to home</Trans>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
