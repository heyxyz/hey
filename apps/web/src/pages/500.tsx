import { Button } from '@components/UI/Button';
import MetaTags from '@components/utils/MetaTags';
import { HomeIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { PAGEVIEW } from 'src/tracking';

const Custom500: FC = () => {
  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.ERROR_500 });
  }, []);

  return (
    <div className="flex-col page-center">
      <MetaTags title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Looks like something went wrong!</h1>
        <div className="mb-4 text-gray-500">
          We track these errors automatically, but if the problem persists feel free to contact us. In the
          meantime, try refreshing.
        </div>
        <Link href="/">
          <Button className="flex mx-auto item-center" size="lg" icon={<HomeIcon className="w-4 h-4" />}>
            <div>Go to home</div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
