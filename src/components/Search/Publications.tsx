import { useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { SearchPublicationsDocument } from '@generated/documents';
import { LensterPublication } from '@generated/lenstertypes';
import { CustomFiltersTypes, SearchRequestTypes } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

interface Props {
  query: string | string[];
}

const Publications: FC<Props> = ({ query }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(SearchPublicationsDocument, {
    variables: { request, reactionRequest, profileId }
  });

  // @ts-ignore
  const publications = data?.search?.items;
  // @ts-ignore
  const pageInfo = data?.search?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.PUBLICATION_SEARCH);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <PublicationsShimmer />}
      {publications?.length === 0 && (
        <EmptyState
          message={
            <div>
              No publications for <b>&ldquo;{query}&rdquo;</b>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load publications list" error={error} />
      {!error && !loading && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: LensterPublication, index: number) => (
              <SinglePublication key={`${post?.id}_${index}`} publication={post} />
            ))}
          </Card>
          {pageInfo?.next && publications?.length !== pageInfo.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Publications;
