import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import getAvatar from '@hey/helpers/getAvatar';
import getProfile from '@hey/helpers/getProfile';
import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import { StackedAvatars } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface MutualFollowersProps {
  handle: string;
  profileId: string;
  viaPopover?: boolean;
}

const MutualFollowers: FC<MutualFollowersProps> = ({
  handle,
  profileId,
  viaPopover = false
}) => {
  const { currentProfile } = useProfileStore();

  const { data, error, loading } = useMutualFollowersQuery({
    skip: !profileId || !currentProfile?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: currentProfile?.id,
        viewing: profileId
      }
    }
  });

  const profiles =
    (data?.mutualFollowers?.items.slice(0, 4) as Profile[]) || [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Link
      className={cn(
        viaPopover ? 'text-xs' : 'text-sm',
        'ld-text-gray-500 flex cursor-pointer items-center space-x-2.5'
      )}
      href={`/u/${handle}/mutuals`}
    >
      <StackedAvatars
        avatars={profiles.map((profile) => getAvatar(profile))}
        limit={3}
      />
      <div>
        <span>Followed by </span>
        {children}
      </div>
    </Link>
  );

  if (profiles.length === 0 || loading || error) {
    return null;
  }

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName} and </span>
        <span>{getProfile(profileTwo).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}, </span>
        <span>
          {getProfile(profileTwo).displayName}
          {isZero ? ' and ' : ', '}
        </span>
        <span>{getProfile(profileThree).displayName} </span>
        {!isZero ? (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
          </span>
        ) : null}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{getProfile(profileOne).displayName}, </span>
      <span>{getProfile(profileTwo).displayName}, </span>
      <span>{getProfile(profileThree).displayName} </span>
      <span>and others</span>
    </Wrapper>
  );
};

export default MutualFollowers;
