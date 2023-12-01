import { HomeIcon } from '@heroicons/react/24/outline';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import MetaTags from '@/components/Common/MetaTags';

const Custom404: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`404 • ${APP_NAME}`} />
      <img
        src={`${STATIC_IMAGES_URL}/gifs/nyan-cat.gif`}
        alt="Nyan Cat"
        className="h-60"
        height={240}
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Oops, Lost‽</h1>
        <div className="mb-4">This page could not be found.</div>
        <Link to="/">
          <Button
            className="mx-auto flex items-center"
            size="lg"
            icon={<HomeIcon className="h-4 w-4" />}
          >
            Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
