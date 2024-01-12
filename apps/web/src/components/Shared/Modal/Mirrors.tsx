import type { Profile, ProfilesRequest } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { LimitType, useProfilesQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface MirrorsProps {
  publicationId: string;
}

const Mirrors: FC<MirrorsProps> = ({ publicationId }) => {
  // Variables
  const request: ProfilesRequest = {
    limit: LimitType.TwentyFive,
    where: { whoMirroredPublication: publicationId }
  };

  const { data, error, fetchMore, loading } = useProfilesQuery({
    skip: !publicationId,
    variables: { request }
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
    return <Loader message="Loading mirrors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<ArrowsRightLeftIcon className="text-brand-500 size-8" />}
          message="No mirrors."
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mirrors"
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

export default Mirrors;
