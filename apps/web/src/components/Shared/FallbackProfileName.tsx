import type { Profile } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import Slug from './Slug';

interface FallbackProfileNameProps {
  profile?: Profile;
  className?: string;
  separator?: ReactNode;
}

const FallbackProfileName: FC<FallbackProfileNameProps> = ({
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
        href={getProfile(profile).link}
        className={cn('max-w-sm truncate hover:underline', className)}
      >
        <b className="whitespace-nowrap">
          {profile?.metadata?.displayName ? (
            sanitizeDisplayName(profile?.metadata.displayName)
          ) : (
            <Slug
              slug={getProfile(profile).slug}
              prefix={getProfile(profile).prefix}
            />
          )}
        </b>
      </Link>
      {separator ? <span>{separator}</span> : null}
    </>
  );
};

export default FallbackProfileName;
