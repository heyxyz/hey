import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { GET_LIST_QUERY_KEY } from "@hey/helpers/api/lists/getList";
import type { List } from "@hey/types/hey";
import { Button } from "@hey/ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePinnedListStore } from "src/store/persisted/usePinnedListStore";

interface PinUnpinButtonProps {
  list: List;
  small?: boolean;
}

const PinUnpinButton: FC<PinUnpinButtonProps> = ({ list, small = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { pinnedLists, setPinnedLists } = usePinnedListStore();
  const queryClient = useQueryClient();

  const handlePinUnpin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/lists/pin`,
        { id: list.id, pin: !list.pinned },
        { headers: getAuthApiHeaders() }
      );

      if (list.pinned) {
        setPinnedLists(
          pinnedLists.filter((pinnedList) => pinnedList.id !== list.id)
        );
      } else {
        setPinnedLists([...pinnedLists, list]);
      }
      queryClient.setQueryData([GET_LIST_QUERY_KEY, list.id], (data: List) => ({
        ...data,
        pinned: !list.pinned,
        totalPins: data.totalPins + (list.pinned ? -1 : 1)
      }));
      toast.success(`List ${list.pinned ? "unpinned" : "pinned"}`);
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Pin"
      disabled={isLoading}
      onClick={handlePinUnpin}
      outline
      size={small ? "sm" : "md"}
    >
      {list.pinned ? "Unpin" : "Pin"}
    </Button>
  );
};

export default PinUnpinButton;
