import type { MarkupLinkProps } from '@hey/types/misc';
import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { hashflags } from '@hey/data/hashflags';
import { prideHashtags } from '@hey/data/pride-hashtags';
import { PUBLICATION } from '@hey/data/tracking';
import isPrideMonth from '@hey/lib/isPrideMonth';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import urlcat from 'urlcat';

const Hashtag: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();
  const hasHashflag = Object.prototype.hasOwnProperty.call(hashflags, tag);
  const isPrideHashtag = isPrideMonth() ? prideHashtags.includes(tag) : false;

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={urlcat('/search', {
            q: title,
            src: 'link_click',
            type: 'pubs'
          })}
          onClick={(event) => {
            stopEventPropagation(event);
            Leafwatch.track(PUBLICATION.CLICK_HASHTAG, { hashtag: tag });
          }}
        >
          {isPrideHashtag ? <span className="pride-text">{title}</span> : title}
        </Link>
      </span>
      {hasHashflag ? (
        <img
          alt={tag}
          className="!mr-0.5 h-4"
          height={16}
          src={`${STATIC_IMAGES_URL}/hashflags/${hashflags[tag]}.png`}
        />
      ) : null}
    </span>
  );
};

export default Hashtag;
