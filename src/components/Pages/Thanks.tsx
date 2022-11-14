import Footer from '@components/Shared/Footer';
import MetaTags from '@components/utils/MetaTags';
import { HeartIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { APP_NAME, STATIC_ASSETS } from 'src/constants';
import { PAGEVIEW } from 'src/tracking';

interface Props {
  name: string;
  logo: string;
  url: string;
  size: number;
  children: ReactNode;
}

const Brand: FC<Props> = ({ name, logo, url, size, children }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="pt-10 space-y-5">
      <img
        className="mx-auto"
        style={{ height: size }}
        src={`${STATIC_ASSETS}/thanks/${logo}-${resolvedTheme === 'dark' ? 'dark' : 'light'}.svg`}
        alt={`${name}'s Logo`}
      />
      <div className="pt-2 mx-auto sm:w-2/3">{children}</div>
      <div>
        <a className="font-bold" href={url} target="_blank" rel="noreferrer noopener">
          ➜ Go to {name}
        </a>
      </div>
    </div>
  );
};

const Thanks: FC = () => {
  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.THANKS });
  }, []);

  return (
    <>
      <MetaTags title={`Thanks • ${APP_NAME}`} />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-3xl font-bold text-white md:text-4xl">
            <div>Thank you!</div>
            <HeartIcon className="w-7 h-7 text-pink-600" />
          </div>
          <div className="text-white">for supporting our community</div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg lg:w-2/4 max-w-3/4">
            <div className="px-5 pb-10 space-y-10 max-w-none text-center text-gray-900 divide-y dark:text-gray-200 dark:divide-gray-700">
              <Brand
                name="Vercel"
                logo="vercel"
                url={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
                size={40}
              >
                Vercel combines the best developer experience with an obsessive focus on end-user performance.
                Vercel platform enables frontend teams to do their best work.
              </Brand>
              <Brand name="Imagekit" logo="imagekit" url="https://imagekit.io" size={50}>
                Image CDN with automatic optimization, real-time transformation, and storage that you can
                integrate with existing setup in minutes.
              </Brand>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-5 pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Thanks;
