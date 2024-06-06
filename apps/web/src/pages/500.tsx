import type { FC } from 'react';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@good/data/constants';
import { Button } from '@good/ui';
import cn from '@good/ui/cn';
import { goodFont } from '@helpers/fonts';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Custom500: FC = () => {
  return (
    <div className={cn('page-center flex-col', goodFont.className)}>
      <MetaTags title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          Looks like something went wrong!
        </h1>
        <div className="ld-text-gray-500 mb-4">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Link href="/">
          <Button
            className="mx-auto flex items-center"
            icon={<HomeIcon className="size-4" />}
            size="lg"
          >
            Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
