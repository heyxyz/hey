import UserProfile from '@components/Shared/UserProfile';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type { Profile, WhoActedOnPublicationRequest } from '@lenster/lens';
import { LimitType, useWhoActedOnPublicationQuery } from '@lenster/lens';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  // Variables
  const request: WhoActedOnPublicationRequest = {
    on: publicationId,
    limit: LimitType.Fifty
  };

  const { data, loading, error, fetchMore } = useWhoActedOnPublicationQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoActedOnPublication?.items;
  const pageInfo = data?.whoActedOnPublication?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message={t`Loading collectors`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No collectors.`}
          icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div
      className="max-h-[80vh] overflow-y-auto"
      data-testid="collectors-modal"
    >
      <ErrorMessage
        className="m-5"
        title={t`Failed to load collectors`}
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(index, profile) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile.operations.isFollowedByMe.value}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.COLLECTORS_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Collectors;
