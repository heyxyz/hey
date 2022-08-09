import { Card } from '@components/UI/Card';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  og: any;
}

const Embed: FC<Props> = ({ og }) => {
  return (
    <div className="mt-4 text-sm sm:w-4/6">
      <a
        href={og.url}
        onClick={() => {
          Mixpanel.track(PUBLICATION.OEMBED_CLICK);
        }}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Card forceRounded>
          {!og.isSquare && og.thumbnail && (
            <img className="w-full rounded-t-xl" src={og.thumbnail} alt="Thumbnail" />
          )}
          <div className="flex items-center">
            {og.isSquare && og.thumbnail && (
              <img
                className="w-36 h-36 rounded-l-xl"
                height={144}
                width={144}
                src={og.thumbnail}
                alt="Thumbnail"
              />
            )}
            <div className="p-5 truncate">
              <div className="space-y-1.5">
                {og.title && <div className="font-bold line-clamp-1">{og.title}</div>}
                {og.description && <div className="text-gray-500 line-clamp-2">{og.description}</div>}
                {og.site && (
                  <div className="flex items-center pt-1.5 space-x-1">
                    {og.favicon && (
                      <img
                        className="w-4 h-4 rounded-full"
                        height={16}
                        width={16}
                        src={og.favicon}
                        alt="Favicon"
                      />
                    )}
                    <div className="text-xs text-gray-500">{og.site}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </a>
    </div>
  );
};

export default Embed;
