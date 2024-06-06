import type { AnyPublication, FeedItem } from '@good/lens';
import type { FC } from 'react';

import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';
import getProfile from '@good/helpers/getProfile';
import { isMirrorPublication } from '@good/helpers/publicationHelpers';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { Image } from '@good/ui';
import cn from '@good/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';

interface PublicationAvatarProps {
  feedItem?: FeedItem;
  publication: AnyPublication;
  quoted?: boolean;
}

const PublicationAvatar: FC<PublicationAvatarProps> = ({
  feedItem,
  publication,
  quoted = false
}) => {
  const { push } = useRouter();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const rootPublication = feedItem ? feedItem?.root : targetPublication;
  const profile = feedItem ? rootPublication.by : targetPublication.by;

  return (
    <Link
      className="contents"
      href={getProfile(profile).link}
      onClick={stopEventPropagation}
    >
      <Image
        alt={profile.id}
        className={cn(
          quoted ? 'size-6' : 'size-11',
          'z-[1] cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700'
        )}
        height={quoted ? 25 : 44}
        loading="lazy"
        onClick={() => push(getProfile(profile).link)}
        onError={({ currentTarget }) => {
          currentTarget.src = getLennyURL(profile.id);
        }}
        src={getAvatar(profile)}
        width={quoted ? 25 : 44}
      />
    </Link>
  );
};

export default memo(PublicationAvatar);
