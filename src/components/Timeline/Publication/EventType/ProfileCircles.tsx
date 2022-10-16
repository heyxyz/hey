import type { Profile } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

interface Props {
  profiles: Profile[];
  totalCount: number;
  context?: string;
}

const ProfileCircles: FC<Props> = ({ profiles, totalCount, context }) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div className="mr-0 sm:mr-10 text-sm text-gray-500 flex items-center space-x-1.5 cursor-pointer">
      <span className="pr-1.5">{context}</span>
      <div className="contents -space-x-2">
        {profiles.slice(0, 3)?.map((profile, i) => (
          <Link key={`${profile.handle}_${i}`} href={`/u/${profile?.handle}`}>
            <img
              className="w-5 h-5 rounded-full border dark:border-gray-700/80"
              src={getAvatar(profile)}
              alt={profile?.handle}
            />
          </Link>
        ))}
      </div>
      {children}
    </div>
  );

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle} and </span>
        <span>{profileTwo?.name ?? profileTwo?.handle}</span>
      </Wrapper>
    );
  }

  if (profiles?.length >= 3) {
    const calculatedCount = totalCount - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle}, </span>
        <span>
          {profileTwo?.name ?? profileTwo?.handle}
          {isZero ? ' and ' : ', '}
        </span>
        <span>{profileThree?.name ?? profileThree?.handle} </span>
        {!isZero && (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
          </span>
        )}
      </Wrapper>
    );
  }

  return null;
};

export default ProfileCircles;
