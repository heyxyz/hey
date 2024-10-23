import Loader from "@components/Shared/Loader";
import SingleList from "@components/Shared/SingleList";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import type { List } from "@hey/types/hey";
import { Button, Card, EmptyState, ErrorMessage, H5, Modal } from "@hey/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import Create from "./Create";

interface ListsProps {
  profile: Profile;
}

const Lists: FC<ListsProps> = ({ profile }) => {
  const { currentProfile } = useProfileStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingList, setDeletingList] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const getLists = async (): Promise<List[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lists/all`, {
        params: { id: profile.id }
      });

      return response.data?.result;
    } catch {
      return [];
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllLists", profile.id],
    queryFn: getLists
  });

  const deleteList = async (id: string) => {
    try {
      setDeleting(true);
      setDeletingList(id);

      const confirmed = await confirm(
        "Are you sure you want to delete this list?"
      );

      if (!confirmed) {
        return toast.error("Operation cancelled");
      }

      toast.promise(
        axios.post(
          `${HEY_API_URL}/lists/delete`,
          { id },
          { headers: getAuthApiHeaders() }
        ),
        {
          error: "Failed to delete list",
          loading: "Deleting list...",
          success: () => {
            queryClient.setQueryData<List[]>(
              ["getAllLists", currentProfile?.id],
              (oldData) => oldData?.filter((list) => list.id !== id)
            );

            return "List deleted";
          }
        }
      );
    } finally {
      setDeleting(false);
      setDeletingList(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <H5>{getProfile(profile).slugWithPrefix}'s Lists</H5>
        {profile.id === currentProfile?.id && (
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
                {profile.id === currentProfile?.id && (
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={deletingList === list.id && deleting}
                    onClick={() => deleteList(list.id)}
                    outline
                  >
                    Delete
                  </Button>
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
        <Create />
      </Modal>
    </Card>
  );
};

export default Lists;
