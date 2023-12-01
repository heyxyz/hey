import type { Profile } from '@hey/lens';
import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction
} from 'react';

import useProfileStore from '@/store/persisted/useProfileStore';

interface MutualFollowersProps {
  setShowMutualFollowersModal?: Dispatch<SetStateAction<boolean>>;
  profile: Profile;
}

const MutualFollowers: FC<MutualFollowersProps> = ({
  setShowMutualFollowersModal,
  profile
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { data, loading, error } = useMutualFollowersQuery({
    variables: {
      request: {
        viewing: profile?.id,
        observer: currentProfile?.id,
        limit: LimitType.Ten
      }
    },
    skip: !profile?.id || !currentProfile?.id
  });

  const profiles =
    (data?.mutualFollowers?.items.slice(0, 4) as Profile[]) ?? [];

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
              key={profile.id}
              className="h-5 w-5 rounded-full border dark:border-gray-700"
              src={getAvatar(profile)}
              alt={profile.id}
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
