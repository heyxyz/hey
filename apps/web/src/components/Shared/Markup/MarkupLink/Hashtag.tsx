import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { hashflags } from '@hey/data/hashflags';
import { prideHashtags } from '@hey/data/pride-hashtags';
import { PUBLICATION } from '@hey/data/tracking';
import isPrideMonth from '@hey/lib/isPrideMonth';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@hey/types/misc';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

const Hashtag: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(tag);
  const isPrideHashtag = isPrideMonth() ? prideHashtags.includes(tag) : false;

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={`/search?q=${title.slice(1)}&type=pubs&src=link_click`}
          onClick={(event) => {
            stopEventPropagation(event);
            Leafwatch.track(PUBLICATION.CLICK_HASHTAG, {
              hashtag: title.slice(1)
            });
          }}
        >
          {isPrideHashtag ? <span className="pride-text">{title}</span> : title}
        </Link>
      </span>
      {hasHashflag ? (
        <img
          className="!mr-0.5 h-4"
          height={16}
          src={`${STATIC_IMAGES_URL}/hashflags/${hashflags[tag]}.png`}
          alt={tag}
        />
      ) : null}
    </span>
  );
};

export default Hashtag;
