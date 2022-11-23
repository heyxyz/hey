import { Button } from '@components/UI/Button';
import MetaTags from '@components/utils/MetaTags';
import { HomeIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { PAGEVIEW } from 'src/tracking';

const Custom404: FC = () => {
  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.ERROR_404 });
  }, []);

  return (
    <div className="flex-col page-center">
      <MetaTags title={`404 • ${APP_NAME}`} />
      <img src={`${STATIC_IMAGES_URL}/gifs/nyan-cat.gif`} alt="Nyan Cat" className="h-60" height={240} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Oops, Lost‽</h1>
        <div className="mb-4">This page could not be found.</div>
        <Link href="/">
          <Button className="flex mx-auto item-center" size="lg" icon={<HomeIcon className="w-4 h-4" />}>
            <div>Go to home</div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
