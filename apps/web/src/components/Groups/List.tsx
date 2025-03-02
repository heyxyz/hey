import GroupListShimmer from "@components/Shared/Shimmer/GroupListShimmer";
import SingleGroup from "@components/Shared/SingleGroup";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { GroupsTabFocus } from ".";

interface ListProps {
  focus: GroupsTabFocus;
}

const List: FC<ListProps> = ({ focus }) => {
  const { currentAccount } = useAccountStore();

  const request: GroupsRequest = {
    filter: {
      ...(focus === GroupsTabFocus.Member && {
        member: currentAccount?.address
      }),
      ...(focus === GroupsTabFocus.Managed && {
        managedBy: { address: currentAccount?.address }
      })
    },
    orderBy: GroupsOrderBy.LatestFirst,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useGroupsQuery({
    variables: { request }
  });

  const groups = data?.groups?.items;
  const pageInfo = data?.groups?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <GroupListShimmer />
      </Card>
    );
  }

  if (groups?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<UserGroupIcon className="size-8" />}
          message="No groups."
          hideCard
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load groups"
      />
    );
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        data={groups}
        endReached={onEndReached}
        itemContent={(_, group) => (
          <div className="p-5">
            <SingleGroup group={group} showDescription isBig />
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default List;
