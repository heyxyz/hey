import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import type { FollowingRequest, Profile } from 'lens';
import { useFollowingQuery } from 'lens';
import formatHandle from 'lib/formatHandle';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { FollowSource } from 'src/tracking';
import { EmptyState, ErrorMessage } from 'ui';

interface FollowingProps {
  profile: Profile;
  onProfileSelected?: (profile: Profile) => void;
}

const Following: FC<FollowingProps> = ({ profile, onProfileSelected }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: FollowingRequest = { address: profile?.ownedBy, limit: 30 };

  const { data, loading, error, fetchMore } = useFollowingQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followings = [...new Set(data?.following?.items)];
  const pageInfo = data?.following?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      }).then(({ data }) => {
        setHasMore(data?.following?.items?.length > 0);
      });
    }
  });

  if (loading) {
    return <Loader message={t`Loading following`} />;
  }

  if (followings?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
            <span>
              <Trans>doesn’t follow anyone.</Trans>
            </span>
          </div>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="followings-modal">
      <ErrorMessage className="m-5" title={t`Failed to load following`} error={error} />
      <div className="divide-y dark:divide-gray-700">
        {followings?.map((following, index) => (
          <div
            className={`p-5 dark:bg-black ${
              onProfileSelected && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
            key={following?.profile?.id}
            onClick={
              onProfileSelected && following.profile
                ? () => {
                    onProfileSelected(following.profile as Profile);
                  }
                : undefined
            }
          >
            <UserProfile
              profile={following?.profile as Profile}
              linkToProfile={!onProfileSelected}
              isFollowing={following?.profile?.isFollowedByMe}
              followPosition={index + 1}
              followSource={FollowSource.FOLLOWING_MODAL}
              showBio
              showFollow
              showUserPreview={false}
              isModal
            />
          </div>
        ))}
      </div>
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default Following;
