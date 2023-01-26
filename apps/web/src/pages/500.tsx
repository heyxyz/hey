import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { HomeIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';

const Custom500: FC = () => {
  return (
    <div className="flex-col page-center">
      <MetaTags title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Looks like something went wrong!</Trans>
        </h1>
        <div className="mb-4 lt-text-gray-500">
          <Trans>
            We track these errors automatically, but if the problem persists feel free to contact us. In the
            meantime, try refreshing.
          </Trans>
        </div>
        <Link href="/">
          <Button className="flex mx-auto item-center" size="lg" icon={<HomeIcon className="w-4 h-4" />}>
            <Trans>Go to home</Trans>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
