import type { Profile } from '@good/lens';
import type { FC, ReactNode } from 'react';

import getProfile from '@good/helpers/getProfile';
import cn from '@good/ui/cn';
import Link from 'next/link';

import Slug from './Slug';

interface FallbackProfileNameProps {
  className?: string;
  profile?: Profile;
  separator?: ReactNode;
}

const FallbackProfileName: FC<FallbackProfileNameProps> = ({
  className = '',
  profile,
  separator = ''
}) => {
  if (!profile) {
    return null;
  }

  return (
    <>
      <Link
        className={cn(
          'max-w-sm truncate outline-none hover:underline focus:underline',
          className
        )}
        href={getProfile(profile).link}
      >
        <b className="whitespace-nowrap">
          {profile?.metadata?.displayName ? (
            getProfile(profile).displayName
          ) : (
            <Slug slug={getProfile(profile).slugWithPrefix} />
          )}
        </b>
      </Link>
      {separator ? <span>{separator}</span> : null}
    </>
  );
};

export default FallbackProfileName;
