import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import cn from '@lenster/ui/cn';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import Slug from './Slug';

interface ProfileNameOrHandleProps {
  profile?: Profile;
  className?: string;
  separator?: ReactNode;
}

const ProfileNameOrHandle: FC<ProfileNameOrHandleProps> = ({
  profile,
  className = '',
  separator = ''
}) => {
  if (!profile) {
    return null;
  }

  return (
    <>
      <Link
        href={`/u/${formatHandle(profile?.handle)}`}
        className={cn('max-w-sm truncate hover:underline', className)}
      >
        <b className="whitespace-nowrap">
          {profile.metadata?.displayName ? (
            sanitizeDisplayName(profile.metadata.displayName)
          ) : (
            <Slug slug={formatHandle(profile?.handle)} prefix="@" />
          )}
        </b>
      </Link>
      {separator ? <span>{separator}</span> : null}
    </>
  );
};

export default ProfileNameOrHandle;
