import { gql, useQuery } from '@apollo/client';
import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardBody } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { CustomFiltersTypes, Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { UsersIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

const SEARCH_PROFILES_QUERY = gql`
  query SearchProfiles($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...ProfileFields
        }
        pageInfo {
          next
          totalCount
        }
      }
    }
  }
  ${ProfileFields}
`;

interface Props {
  query: string | string[];
}

const Profiles: FC<Props> = ({ query }) => {
  // Variables
  const request = { query, type: 'PROFILE', customFilters: [CustomFiltersTypes.Gardeners], limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(SEARCH_PROFILES_QUERY, {
    variables: { request },
    skip: !query
  });

  const pageInfo = data?.search?.pageInfo;
  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.PROFILE_SEARCH);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <UserProfilesShimmer isBig />}
      {data?.search?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              No profiles for <b>&ldquo;{query}&rdquo;</b>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load profiles list" error={error} />
      {!error && !loading && (
        <>
          <div className="space-y-3">
            {data?.search?.items?.map((profile: Profile) => (
              <Card key={profile?.id}>
                <CardBody>
                  <UserProfile profile={profile} showBio isBig />
                </CardBody>
              </Card>
            ))}
          </div>
          {pageInfo?.next && data?.search?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Profiles;
