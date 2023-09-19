import type { Profile } from '@lenster/lens';
import { LimitType, useMutualFollowersQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import { Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { useAppStore } from 'src/store/app';

interface MutualFollowersProps {
  setShowMutualFollowersModal?: Dispatch<SetStateAction<boolean>>;
  profile: Profile;
}

const MutualFollowers: FC<MutualFollowersProps> = ({
  setShowMutualFollowersModal,
  profile
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

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

  const profiles = data?.mutualFollowers?.items ?? [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div
      className="lt-text-gray-500 flex cursor-pointer items-center space-x-2.5 text-sm"
      onClick={() => setShowMutualFollowersModal?.(true)}
      aria-hidden="true"
    >
      <div className="contents -space-x-2">
        {profiles?.map((profile) => (
          <Image
            key={profile.handle}
            className="h-5 w-5 rounded-full border dark:border-gray-700"
            src={getAvatar(profile)}
            alt={formatHandle(profile?.handle)}
          />
        ))}
      </div>
      <div>
        <span>
          <Trans>Followed by</Trans>{' '}
        </span>
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
        <span>
          {profileOne.metadata?.displayName ?? formatHandle(profileOne?.handle)}
        </span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>
          {profileOne.metadata?.displayName ?? formatHandle(profileOne?.handle)}{' '}
          and{' '}
        </span>
        <span>
          {profileTwo.metadata?.displayName ?? formatHandle(profileTwo?.handle)}
        </span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>
          {profileOne.metadata?.displayName ?? formatHandle(profileOne?.handle)}
          ,{' '}
        </span>
        <span>
          {profileTwo.metadata?.displayName ?? formatHandle(profileTwo?.handle)}
          {isZero ? ' and ' : ', '}
        </span>
        <span>
          {profileThree.metadata?.displayName ??
            formatHandle(profileThree?.handle)}{' '}
        </span>
        {!isZero ? (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
          </span>
        ) : null}
      </Wrapper>
    );
  }

  return null;
};

export default MutualFollowers;
