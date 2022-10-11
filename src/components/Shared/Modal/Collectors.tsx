import { useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { Profile, Wallet } from '@generated/types';
import { CollectorsDocument } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { BirdStats } from '@lib/birdstats';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Collectors: FC<Props> = ({ publicationId }) => {
  // Variables
  const request = { publicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(CollectorsDocument, {
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoCollectedPublication?.items;
  const pageInfo = data?.whoCollectedPublication?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      BirdStats.track(PAGINATION.COLLECTORS);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading collectors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No collectors.</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load collectors" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((wallet) => (
            <div className="p-5" key={wallet?.address}>
              {wallet?.defaultProfile ? (
                <UserProfile
                  profile={wallet?.defaultProfile as Profile}
                  showBio
                  showFollow
                  isFollowing={wallet?.defaultProfile?.isFollowedByMe}
                />
              ) : (
                <WalletProfile wallet={wallet as Wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && profiles?.length !== pageInfo.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Collectors;
