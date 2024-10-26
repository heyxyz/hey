import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import { Button } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePinnedListStore } from "src/store/persisted/usePinnedListStore";

interface PinUnpinButtonProps {
  list: List;
  small?: boolean;
}

const PinUnpinButton: FC<PinUnpinButtonProps> = ({ list, small = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pinned, setPinned] = useState(list.pinned);
  const { pinnedLists, setPinnedLists } = usePinnedListStore();

  useEffect(() => {
    setPinned(list.pinned);
  }, [list.pinned]);

  const handlePinUnpin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/lists/pin`,
        { id: list.id, pin: !pinned },
        { headers: getAuthApiHeaders() }
      );

      setPinned(!pinned);
      if (pinned) {
        setPinnedLists(
          pinnedLists.filter((pinnedList) => pinnedList.id !== list.id)
        );
      } else {
        setPinnedLists([...pinnedLists, list]);
      }
      toast.success(`List ${pinned ? "unpinned" : "pinned"}`);
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
      {pinned ? "Unpin" : "Pin"}
    </Button>
  );
};

export default PinUnpinButton;
