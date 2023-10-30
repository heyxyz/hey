import UserProfile from '@components/Shared/UserProfile';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { Profile, ProfilesRequest } from '@hey/lens';
import { LimitType, useProfilesQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface QuotesProps {
  publicationId: string;
}

const Quotes: FC<QuotesProps> = ({ publicationId }) => {
  // Variables
  const request: ProfilesRequest = {
    where: { whoQuotedPublication: publicationId },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useProfilesQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;
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
    return <Loader message="Loading quotes" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message="No quotes."
          icon={<ArrowsRightLeftIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        title="Failed to load quotes"
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
                followUnfollowSource={FollowUnfollowSource.QUOTES_MODAL}
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

export default Quotes;
