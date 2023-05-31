import UserProfile from '@components/Shared/UserProfile';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Profile, ProfileQueryRequest } from 'lens';
import { useProfilesQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FollowSource } from 'src/tracking';
import { EmptyState, ErrorMessage } from 'ui';

import Loader from '../Loader';

interface MirrorsProps {
  publicationId: string;
}

const Mirrors: FC<MirrorsProps> = ({ publicationId }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: ProfileQueryRequest = {
    whoMirroredPublicationId: publicationId,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useProfilesQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.profiles?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading mirrors`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No mirrors.`}
          icon={<SwitchHorizontalIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="mirrors-modal">
      <ErrorMessage
        className="m-5"
        title={t`Failed to load mirrors`}
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(index, profile) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile?.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.MIRRORS_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Mirrors;
