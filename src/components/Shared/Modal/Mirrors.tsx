import { useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { MirrorsDocument } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Mirrors: FC<Props> = ({ publicationId }) => {
  // Variables
  const request = { whoMirroredPublicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(MirrorsDocument, {
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.MIRRORS);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading mirrors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No mirrors.</span>}
          icon={<SwitchHorizontalIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load mirrors" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((profile: any) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile profile={profile} showBio showFollow isFollowing={profile?.isFollowedByMe} />
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

export default Mirrors;
