import type { Profile } from '@hey/lens';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';

import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface MutualFollowersProps {
  profile: Profile;
  setShowMutualFollowersModal?: Dispatch<SetStateAction<boolean>>;
}

const MutualFollowers: FC<MutualFollowersProps> = ({
  profile,
  setShowMutualFollowersModal
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { data, error, loading } = useMutualFollowersQuery({
    skip: !profile?.id || !currentProfile?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: currentProfile?.id,
        viewing: profile?.id
      }
    }
  });

  const profiles =
    (data?.mutualFollowers?.items.slice(0, 4) as Profile[]) || [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div
      className="ld-text-gray-500 flex cursor-pointer items-center space-x-2.5 text-sm"
      onClick={() => setShowMutualFollowersModal?.(true)}
    >
      <div className="contents -space-x-2">
        {profiles
          .slice(0, 3)
          ?.map((profile) => (
            <Image
              alt={profile.id}
              className="size-5 rounded-full border dark:border-gray-700"
              key={profile.id}
              src={getAvatar(profile)}
            />
          ))}
      </div>
      <div>
        <span>Followed by </span>
        {children}
      </div>
    </div>
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
