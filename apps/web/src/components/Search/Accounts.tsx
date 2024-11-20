import SingleAccountsShimmer from "@components/Shared/Shimmer/SingleAccountsShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ProfileLinkSource } from "@hey/data/tracking";
import type { Profile, ProfileSearchRequest } from "@hey/lens";
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesQuery
} from "@hey/lens";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";

interface AccountsProps {
  query: string;
}

const Accounts: FC<AccountsProps> = ({ query }) => {
  const request: ProfileSearchRequest = {
    limit: LimitType.TwentyFive,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const { data, error, fetchMore, loading } = useSearchProfilesQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchProfiles;
  const profiles = search?.items;
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <SingleAccountsShimmer isBig />;
  }

  if (profiles?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <span>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load profiles" />;
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-3"
      computeItemKey={(index, profile) => `${profile.id}-${index}`}
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => (
        <Card className="p-5">
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            isBig
            profile={profile as Profile}
            showBio
            source={ProfileLinkSource.Search}
          />
        </Card>
      )}
      useWindowScroll
    />
  );
};

export default Accounts;