import type { Profile, WhoActedOnPublicationRequest } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { LimitType, useWhoActedOnPublicationQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  // Variables
  const request: WhoActedOnPublicationRequest = {
    limit: LimitType.TwentyFive,
    on: publicationId
  };

  const { data, error, fetchMore, loading } = useWhoActedOnPublicationQuery({
    skip: !publicationId,
    variables: { request }
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
    return <Loader message="Loading collectors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<RectangleStackIcon className="text-brand-500 size-8" />}
          message="No collectors."
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load collectors"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(_, profile) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className="p-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <UserProfile
                profile={profile as Profile}
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
