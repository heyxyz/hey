import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import { UsersIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import getProfile from "@hey/helpers/getProfile";
import type { List } from "@hey/types/hey";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import SingleList from "../SingleList";

const AddToList: FC = () => {
  const { currentProfile } = useProfileStore();

  const getLists = async (): Promise<List[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lists/all`, {
        params: { id: currentProfile?.id }
      });

      return response.data?.result;
    } catch {
      return [];
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllLists", currentProfile?.id],
    queryFn: getLists
  });

  if (isLoading) {
    return <ProfileListShimmer />;
  }

  if (data?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(currentProfile).slugWithPrefix}
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

  return (
    <div className="p-5">
      {data?.map((list) => (
        <div key={list.id} className="flex items-center justify-between">
          <SingleList list={list} />
          <Button size="sm" outline>
            Add
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AddToList;
