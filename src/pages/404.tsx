import { Button } from '@components/UI/Button';
import MetaTags from '@components/utils/MetaTags';
import { HomeIcon } from '@heroicons/react/outline';
import { Dogstats } from '@lib/dogstats';
import Link from 'next/link';
import { useEffect } from 'react';
import { APP_NAME, STATIC_ASSETS } from 'src/constants';
import { PAGEVIEW } from 'src/tracking';

export default function Custom404() {
  useEffect(() => {
    Dogstats.track('Pageview', { path: PAGEVIEW.ERROR_404 });
  }, []);

  return (
    <div className="flex-col page-center">
      <MetaTags title={`404 • ${APP_NAME}`} />
      <img src={`${STATIC_ASSETS}/gifs/nyan-cat.gif`} alt="Nyan Cat" className="h-60" height={240} />
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
}
