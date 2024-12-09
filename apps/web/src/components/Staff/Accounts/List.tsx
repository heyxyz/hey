import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowPathIcon, UsersIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import {
  type Account,
  type AccountSearchRequest,
  PageSize,
  useSearchAccountsLazyQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage, Input, Select } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import ViewReports from "./ViewReports";

const List: FC = () => {
  const { pathname } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [searchText, setSearchText] = useState("");
  const [refetching, setRefetching] = useState(false);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const request: ExploreProfilesRequest = {
    limit: LimitType.Fifty,
    orderBy
  };

  const { data, error, fetchMore, loading, refetch } = useExploreProfilesQuery({
    variables: { request }
  });

  const [searchAccounts, { data: searchData, loading: searchLoading }] =
    useSearchAccountsLazyQuery();

  useEffect(() => {
    if (debouncedSearchText) {
      const request: AccountSearchRequest = {
        pageSize: PageSize.Fifty,
        localName: debouncedSearchText
      };

      searchAccounts({ variables: { request } });
    }
  }, [debouncedSearchText]);

  const accounts = searchText
    ? searchData?.searchAccounts.items
    : data?.exploreProfiles.items;
  const pageInfo = data?.exploreProfiles?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    // Disable pagination when searching
    if (searchText) {
      return;
    }

    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const handleRefetch = async () => {
    setRefetching(true);
    await refetch();
    setRefetching(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <Input
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search profiles..."
          value={searchText}
        />
        {searchText ? null : (
          <>
            <Select
              className="w-72"
              defaultValue={orderBy}
              onChange={(value) =>
                setOrderBy(value as ExploreProfilesOrderByType)
              }
              options={Object.values(ExploreProfilesOrderByType).map(
                (type) => ({
                  label: type,
                  selected: orderBy === type,
                  value: type
                })
              )}
            />
            <button onClick={handleRefetch} type="button">
              <ArrowPathIcon
                className={cn(refetching && "animate-spin", "size-5")}
              />
            </button>
          </>
        )}
      </div>
      <div className="divider" />
      <div className="m-5">
        {loading || searchLoading ? (
          <Loader className="my-10" message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load profiles" />
        ) : accounts?.length ? (
          <Virtuoso
            computeItemKey={(index, account) => `${account.address}-${index}`}
            data={accounts}
            endReached={onEndReached}
            itemContent={(_, account) => (
              <div className="flex flex-wrap items-center justify-between gap-y-5 pb-7">
                <Link
                  href={
                    pathname === "/mod"
                      ? getAccount(account as Account).link
                      : getAccount(account as Account).staffLink
                  }
                >
                  <SingleAccount
                    hideFollowButton
                    hideUnfollowButton
                    isBig
                    linkToAccount={false}
                    account={account as Account}
                    showBio={false}
                    showUserPreview={false}
                    timestamp={account.createdAt}
                  />
                </Link>
                <div>
                  <ViewReports address={account.address} />
                </div>
              </div>
            )}
            useWindowScroll
          />
        ) : (
          <EmptyState
            hideCard
            icon={<UsersIcon className="size-8" />}
            message={<span>No profiles</span>}
          />
        )}
      </div>
    </Card>
  );
};

export default List;
