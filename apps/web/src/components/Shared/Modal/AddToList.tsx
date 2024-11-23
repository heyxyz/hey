import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { UsersIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import getLists, { GET_LISTS_QUERY_KEY } from "@hey/helpers/api/lists/getLists";
import getAccount from "@hey/helpers/getAccount";
import type { List } from "@hey/types/hey";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SingleList from "../SingleList";

const AddToList: FC = () => {
  const { currentAccount } = useAccountStore();
  const { profileToAddToList } = useGlobalModalStateStore();
  const [isAdding, setIsAdding] = useState(false);
  const [addingListId, setAddingListId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: () =>
      getLists({
        ownerId: currentAccount?.id,
        viewingId: profileToAddToList?.id
      }),
    queryKey: [GET_LISTS_QUERY_KEY, profileToAddToList?.id]
  });

  if (isLoading) {
    return <AccountListShimmer />;
  }

  if (data?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">
              {getAccount(currentAccount).slugWithPrefix}
            </span>
            <span>doesn't have any lists yet.</span>
          </div>
        }
        hideCard
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load lists"
      />
    );
  }

  const handleAddToList = async (listId: string, add: boolean) => {
    try {
      setIsAdding(true);
      setAddingListId(listId);
      await axios.post(
        `${HEY_API_URL}/lists/add`,
        { listId, profileId: profileToAddToList?.id, add },
        { headers: getAuthApiHeaders() }
      );

      queryClient.setQueryData<List[]>(
        [GET_LISTS_QUERY_KEY, profileToAddToList?.id],
        (oldData) =>
          oldData?.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  isAdded: add,
                  totalAccounts: add
                    ? list.totalAccounts + 1
                    : list.totalAccounts - 1
                }
              : list
          )
      );
      toast.success(`${add ? "Added" : "Removed"} to list`);
      // TODO: Add tracking
    } catch (error) {
      errorToast(error);
    } finally {
      setIsAdding(false);
      setAddingListId(null);
    }
  };

  return (
    <div className="space-y-5 p-5">
      {data?.map((list) => (
        <div key={list.id} className="flex items-center justify-between">
          <SingleList list={list} linkToList={false} />
          <Button
            size="sm"
            onClick={() => handleAddToList(list.id, !list.isAdded)}
            disabled={isAdding && addingListId === list.id}
            outline
          >
            {list.isAdded ? "Remove" : "Add"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AddToList;
