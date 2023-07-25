import getAvatar from '@lenster/lib/getAvatar';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import type { Community } from '@lenster/types/communities';
import { Image } from '@lenster/ui';
import { formatTime, getTwitterFormat } from '@lib/formatTime';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import Markup from './Markup';
import Slug from './Slug';

interface CommunityProfileProps {
  community: Community;
  isBig?: boolean;
  linkToProfile?: boolean;
  showBio?: boolean;
  timestamp?: Date;
}

const CommunityProfile: FC<CommunityProfileProps> = ({
  community,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  timestamp = ''
}) => {
  const UserAvatar = () => (
    <Image
      src={getAvatar(community)}
      loading="lazy"
      className={clsx(
        isBig ? 'h-14 w-14' : 'h-10 w-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={community?.slug}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={clsx(isBig ? 'font-bold' : 'text-md', 'grid')}>
          <div className="truncate">
            {sanitizeDisplayName(community?.name) ?? community?.slug}
          </div>
        </div>
      </div>
      <div>
        <Slug className="text-sm" slug={community?.slug} prefix="/c/" />
        {timestamp ? (
          <span className="lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs" title={formatTime(timestamp as Date)}>
              {getTwitterFormat(timestamp)}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );

  const CommunityInfo: FC = () => {
    return (
      <div className="mr-8 flex items-center space-x-3">
        <UserAvatar />
        <div>
          <UserName />
          {showBio && community?.description && (
            <div
              // Replace with Tailwind
              style={{ wordBreak: 'break-word' }}
              className={clsx(
                isBig ? 'text-base' : 'text-sm',
                'mt-2',
                'linkify leading-6'
              )}
            >
              <Markup>{community?.description}</Markup>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex items-center justify-between"
      data-testid={`community-profile-${community.id}`}
    >
      {linkToProfile ? (
        <Link href={`/c/${community?.slug}`}>
          <CommunityInfo />
        </Link>
      ) : (
        <CommunityInfo />
      )}
    </div>
  );
};

export default memo(CommunityProfile);
