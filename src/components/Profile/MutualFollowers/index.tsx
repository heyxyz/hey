import type { Profile } from '@generated/types';
import { useMutualFollowersQuery } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import type { Dispatch, FC, ReactNode } from 'react';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';

interface Props {
  setShowMutualFollowersModal?: Dispatch<boolean>;
  profile: Profile;
  variant?: 'xs' | 'sm';
}

const MutualFollowers: FC<Props> = ({ setShowMutualFollowersModal, profile, variant = 'sm' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useMutualFollowersQuery({
    variables: {
      request: {
        viewingProfileId: profile?.id,
        yourProfileId: currentProfile?.id,
        limit: 3
      }
    },
    skip: !profile?.id || !currentProfile?.id
  });

  const profiles = data?.mutualFollowersProfiles?.items ?? [];
  const totalCount = data?.mutualFollowersProfiles?.pageInfo?.totalCount ?? 0;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div
      className={clsx('text-gray-500 flex items-center space-x-2.5 cursor-pointer', {
        'text-sm': variant === 'sm',
        'text-xs': variant === 'xs'
      })}
      onClick={() => {
        setShowMutualFollowersModal?.(true);
        Leafwatch.track(PROFILE.OPEN_MUTUAL_FOLLOWERS);
      }}
    >
      <div className="contents -space-x-2">
        {profiles?.map((profile) => (
          <img
            key={profile.handle}
            className="w-5 h-5 rounded-full border dark:border-gray-700/80"
            src={getAvatar(profile)}
            alt={profile?.handle}
          />
        ))}
      </div>
      <div>
        <span>Followed by </span>
        {children}
      </div>
    </div>
  );

  if (totalCount === 0 || loading || error) {
    return null;
  }

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

  if (profiles?.length === 3) {
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

export default MutualFollowers;
