'use client';
import clsx from 'clsx';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
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
        className={clsx('max-w-sm truncate hover:underline', className)}
      >
        <b className="whitespace-nowrap">
          {profile?.name ? (
            profile?.name
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
