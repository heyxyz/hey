import { Card } from '@components/UI/Card';
import type { OG } from '@generated/types';
import { Analytics } from '@lib/analytics';
import imageProxy from '@lib/imageProxy';
import { ATTACHMENT } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  og: OG;
}

const Embed: FC<Props> = ({ og }) => {
  return (
    <div className="mt-4 text-sm sm:w-4/6">
      <Link
        href={og.url}
        onClick={(event) => {
          event.stopPropagation();
          Analytics.track(PUBLICATION.OEMBED_CLICK);
        }}
        target={og.url.includes(location.host) ? '_self' : '_blank'}
        rel="noreferrer noopener"
      >
        <Card forceRounded>
          {!og.isSquare && og.thumbnail && (
            <img
              className="w-full rounded-t-xl"
              onError={({ currentTarget }) => {
                currentTarget.src = og.thumbnail;
              }}
              src={imageProxy(og.thumbnail, ATTACHMENT)}
              alt="Thumbnail"
            />
          )}
          <div className="flex items-center">
            {og.isSquare && og.thumbnail && (
              <img
                className="h-36 w-36 rounded-l-xl"
                height={144}
                width={144}
                onError={({ currentTarget }) => {
                  currentTarget.src = og.thumbnail;
                }}
                src={imageProxy(og.thumbnail, ATTACHMENT)}
                alt="Thumbnail"
              />
            )}
            <div className="truncate p-5">
              <div className="space-y-1.5">
                {og.title && <div className="line-clamp-1 font-bold">{og.title}</div>}
                {og.description && <div className="lt-text-gray-500 line-clamp-2">{og.description}</div>}
                {og.site && (
                  <div className="flex items-center space-x-1 pt-1.5">
                    {og.favicon && (
                      <img
                        className="h-4 w-4 rounded-full"
                        height={16}
                        width={16}
                        src={og.favicon}
                        alt="Favicon"
                      />
                    )}
                    <div className="lt-text-gray-500 text-xs">{og.site}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Embed;
