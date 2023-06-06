import { hashflags, prideHashtags } from '@lenster/data';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import isPrimeMonth from '@lenster/lib/isPrideMonth';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';
import type { MarkupLinkProps } from 'src/types';

const Hashtag: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(tag);
  const isPrideHashtag = isPrimeMonth() ? prideHashtags.includes(tag) : false;

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
      {hasHashflag && (
        <img
          className="!mr-0.5 h-4"
          height={16}
          src={`${STATIC_IMAGES_URL}/hashflags/${hashflags[tag]}.png`}
          alt={tag}
        />
      )}
    </span>
  );
};

export default Hashtag;
