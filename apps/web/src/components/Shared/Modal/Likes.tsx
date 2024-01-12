import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { HeartIcon } from '@heroicons/react/24/outline';
import {
  LimitType,
  type Profile,
  useWhoReactedPublicationQuery,
  type WhoReactedPublicationRequest
} from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface LikesProps {
  publicationId: string;
}

const Likes: FC<LikesProps> = ({ publicationId }) => {
  // Variables
  const request: WhoReactedPublicationRequest = {
    for: publicationId,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useWhoReactedPublicationQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;
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
    return <Loader message="Loading likes" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<HeartIcon className="text-brand-500 size-8" />}
          message="No likes."
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load likes"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(_, like) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className="p-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <UserProfile
                profile={like.profile as Profile}
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

export default Likes;
