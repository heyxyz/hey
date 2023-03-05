import type { MarkupLinkProps } from '@generated/types';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import { STATIC_IMAGES_URL } from 'data/constants';
import { hashflags } from 'data/hashflags';
import Link from 'next/link';
import type { FC } from 'react';

const Hashtag: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!title) {
    return null;
  }

  const hashflag = title.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(hashflag);

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link href={`/search?q=${title.slice(1)}&type=pubs&src=link_click`} onClick={stopEventPropagation}>
          {title}
        </Link>
      </span>
      {hasHashflag && (
        <img
          className="!mr-0.5 h-4"
          height={16}
          src={`${STATIC_IMAGES_URL}/hashflags/${hashflags[hashflag]}.png`}
          alt={hashflag}
        />
      )}
    </span>
  );
};

export default Hashtag;
