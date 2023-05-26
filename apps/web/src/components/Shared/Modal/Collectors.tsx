import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Profile, Wallet, WhoCollectedPublicationRequest } from 'lens';
import { useCollectorsQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { FollowSource } from 'src/tracking';
import { EmptyState, ErrorMessage } from 'ui';

import Loader from '../Loader';

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: WhoCollectedPublicationRequest = { publicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useCollectorsQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = [...new Set(data?.whoCollectedPublication?.items)];
  const pageInfo = data?.whoCollectedPublication?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      }).then(({ data }) => {
        setHasMore(data?.whoCollectedPublication?.items?.length > 0);
      });
    }
  });

  if (loading) {
    return <Loader message={t`Loading collectors`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No collectors.`}
          icon={<CollectionIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="collectors-modal">
      <ErrorMessage className="m-5" title={t`Failed to load collectors`} error={error} />
      <div className="divide-y dark:divide-gray-700">
        {profiles?.map((wallet, index) => (
          <div className="p-5" key={wallet?.address}>
            {wallet?.defaultProfile ? (
              <UserProfile
                profile={wallet?.defaultProfile as Profile}
                isFollowing={wallet?.defaultProfile?.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.COLLECTORS_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            ) : (
              <WalletProfile wallet={wallet as Wallet} />
            )}
          </div>
        ))}
      </div>
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default Collectors;
