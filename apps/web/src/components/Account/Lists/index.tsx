import Loader from "@components/Shared/Loader";
import SingleList from "@components/Shared/SingleList";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import {
  BookmarkIcon as BookmarkIconOutline,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { HEY_API_URL } from "@hey/data/constants";
import getLists, { GET_LISTS_QUERY_KEY } from "@hey/helpers/api/lists/getLists";
import getAccount from "@hey/helpers/getAccount";
import type { Profile } from "@hey/lens";
import type { List } from "@hey/types/hey";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  H5,
  Modal,
  Tooltip
} from "@hey/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import CreateOrEdit from "../../Shared/List/CreateOrEdit";

interface ListsProps {
  account: Profile;
}

const Lists: FC<ListsProps> = ({ account }) => {
  const { currentAccount } = useAccountStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingList, setDeletingList] = useState<string | null>(null);
  const [pinning, setPinning] = useState(false);
  const [pinningList, setPinningList] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getLists({ ownerId: account.id }),
    queryKey: [GET_LISTS_QUERY_KEY, account.id]
  });

  const handleDeleteList = async (id: string) => {
    try {
      setDeleting(true);
      setDeletingList(id);

      const confirmed = await confirm(
        "Are you sure you want to delete this list?"
      );

      if (!confirmed) {
        return toast.error("Operation cancelled");
      }

      await axios.post(
        `${HEY_API_URL}/lists/delete`,
        { id },
        { headers: getAuthApiHeaders() }
      );

      queryClient.setQueryData<List[]>(
        [GET_LISTS_QUERY_KEY, currentAccount?.id],
        (oldData) => oldData?.filter((list) => list.id !== id)
      );
      toast.success("List deleted");
    } catch (error) {
      errorToast(error);
    } finally {
      setDeleting(false);
      setDeletingList(null);
    }
  };

  const handlePinList = async (id: string, pinned: boolean) => {
    try {
      setPinning(true);
      setPinningList(id);
      await axios.post(
        `${HEY_API_URL}/lists/pin`,
        { id, pin: !pinned },
        { headers: getAuthApiHeaders() }
      );

      queryClient.setQueryData<List[]>(
        [GET_LISTS_QUERY_KEY, currentAccount?.id],
        (oldData) =>
          oldData?.map((list) =>
            list.id === id ? { ...list, pinned: !pinned } : list
          )
      );
      toast.success("List pinned");
    } catch (error) {
      errorToast(error);
    } finally {
      setPinning(false);
      setPinningList(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <H5>{getAccount(account).slugWithPrefix}'s Lists</H5>
        {account.id === currentAccount?.id && (
          <Button onClick={() => setShowCreateModal(!showCreateModal)}>
            Create
          </Button>
        )}
      </div>
      <div className="divider" />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-10" message="Loading lists..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load lists" />
        ) : data?.length ? (
          <div className="space-y-6">
            {data?.map((list) => (
              <div key={list.id} className="flex items-center justify-between">
                <SingleList list={list} />
                {account.id === currentAccount?.id && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      content={list.pinned ? "Unpin from Home" : "Pin to Home"}
                      placement="top"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handlePinList(list.id, list.pinned || false)
                        }
                        disabled={pinningList === list.id && pinning}
                      >
                        {list.pinned ? (
                          <BookmarkIconSolid className="size-4" />
                        ) : (
                          <BookmarkIconOutline className="size-4" />
                        )}
                      </button>
                    </Tooltip>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deletingList === list.id && deleting}
                      onClick={() => handleDeleteList(list.id)}
                      outline
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            hideCard
            icon={<ListBulletIcon className="size-8" />}
            message={<span>No lists found</span>}
          />
        )}
      </div>
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create List"
      >
        <CreateOrEdit />
      </Modal>
    </Card>
  );
};

export default Lists;
