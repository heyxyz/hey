import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { HomeIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';

const Custom404: FC = () => {
  return (
    <div className="flex-col page-center">
      <MetaTags title={`404 • ${APP_NAME}`} />
      <img src={`${STATIC_IMAGES_URL}/gifs/nyan-cat.gif`} alt="Nyan Cat" className="h-60" height={240} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Oops, Lost‽</Trans>
        </h1>
        <div className="mb-4">
          <Trans>This page could not be found.</Trans>
        </div>
        <Link href="/">
          <Button className="flex mx-auto item-center" size="lg" icon={<HomeIcon className="w-4 h-4" />}>
            <div>
              <Trans>Go to home</Trans>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
