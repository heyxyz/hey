import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowPathIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  AccountsOrderBy,
  type AccountsRequest,
  PageSize,
  useAccountsLazyQuery,
  useAccountsQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage, Input, Select } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useDebounce } from "@uidotdev/usehooks";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

const List: FC = () => {
  const [orderBy, setOrderBy] = useState<AccountsOrderBy>(
    AccountsOrderBy.AccountScore
  );
  const [searchText, setSearchText] = useState("");
  const [refetching, setRefetching] = useState(false);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const request: AccountsRequest = { orderBy };

  const {
    data: accountsData,
    error: accountsError,
    loading: accountsLoading,
    fetchMore,
    refetch
  } = useAccountsQuery({
    variables: { request }
  });

  const [searchAccounts, { data: searchData, loading: searchLoading }] =
    useAccountsLazyQuery();

  useEffect(() => {
    if (debouncedSearchText) {
      const request: AccountsRequest = {
        pageSize: PageSize.Fifty,
        filter: { searchBy: { localNameQuery: debouncedSearchText } }
      };

      searchAccounts({ variables: { request } });
    }
  }, [debouncedSearchText]);

  const accounts = searchText
    ? searchData?.accounts?.items
    : accountsData?.accounts?.items;
  const pageInfo = accountsData?.accounts?.pageInfo;
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
              onChange={(value) => setOrderBy(value as AccountsOrderBy)}
              options={Object.values(AccountsOrderBy).map((type) => ({
                label: type,
                selected: orderBy === type,
                value: type
              }))}
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
        {accountsLoading || searchLoading ? (
          <Loader className="my-10" message="Loading accounts..." />
        ) : accountsError ? (
          <ErrorMessage error={accountsError} title="Failed to load accounts" />
        ) : accounts?.length ? (
          <Virtuoso
            data={accounts}
            endReached={onEndReached}
            itemContent={(_, account) => (
              <div className="pb-7">
                {/* <Link href={`/staff/accounts/${account.address}`}> */}
                <SingleAccount
                  isBig
                  linkToAccount={false}
                  account={account}
                  showBio={false}
                  showUserPreview={false}
                />
                {/* </Link> */}
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
