import { hashflags, prideHashtags } from '@lenster/data';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import Link from 'next/link';
import type { FC } from 'react';
import type { MarkupLinkProps } from 'src/types';

const Hashtag: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(tag);
  const isPrideHashtag = prideHashtags.includes(tag);

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={`/search?q=${title.slice(1)}&type=pubs&src=link_click`}
          onClick={stopEventPropagation}
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
