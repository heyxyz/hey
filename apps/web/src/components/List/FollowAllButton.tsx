import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { useFollowMutation } from "@hey/lens";
import type { List } from "@hey/types/hey";
import { Button } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import toast from "react-hot-toast";

export const GET_FOLLOW_LIST_QUERY_KEY = "getFollowList";

interface FollowAllButtonProps {
  list: List;
}

const FollowAllButton: FC<FollowAllButtonProps> = ({ list }) => {
  const getFollowList = async (): Promise<string[]> => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/lists/follow`, {
        params: { id: list.id },
        headers: getAuthApiHeaders()
      });
      return data?.result || [];
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryFn: getFollowList,
    queryKey: [GET_FOLLOW_LIST_QUERY_KEY, list.id]
  });

  const [bulkFollow, { loading: following }] = useFollowMutation();

  const handleFollowAll = async () => {
    if (!data || data.length === 0) {
      toast.success("All profiles are already followed");
      return;
    }

    // Process in batches of 50 profiles
    for (let i = 0; i < data.length; i += 50) {
      const batch = data.slice(i, i + 50);
      await bulkFollow({
        variables: {
          request: {
            follow: batch.map((profile) => ({ profileId: profile }))
          }
        }
      });
    }

    toast.success(`Successfully followed ${data.length} profiles`);
  };

  return (
    <Button
      aria-label="Follow all"
      disabled={isLoading || following}
      onClick={handleFollowAll}
      outline
    >
      Follow all
    </Button>
  );
};

export default FollowAllButton;
