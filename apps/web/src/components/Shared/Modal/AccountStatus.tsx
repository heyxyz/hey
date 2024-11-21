import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import { Button, ErrorMessage, Input } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import EmojiPicker from "../EmojiPicker";

const AccountStatus: FC = () => {
  const { currentAccount } = useAccountStore();
  const { setShowEditStatusModal } = useGlobalModalStateStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { isLoading, error } = useQuery({
    enabled: Boolean(currentAccount?.id),
    queryFn: () =>
      getAccountDetails(currentAccount?.id).then((data) => {
        setMessage(data?.status?.message || null);
        setEmoji(data?.status?.emoji || null);
        return data;
      }),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, currentAccount?.id]
  });

  if (isLoading) {
    return <AccountListShimmer />;
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load profile status"
      />
    );
  }

  const handleClear = async () => {
    try {
      await axios.post(`${HEY_API_URL}/profile/status/clear`, undefined, {
        headers: getAuthApiHeaders()
      });

      setMessage(null);
      setEmoji(null);
      setShowEditStatusModal(false);
      queryClient.invalidateQueries({
        queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY]
      });
      toast.success("Profile status cleared");
    } catch (error) {
      errorToast(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.post(
        `${HEY_API_URL}/profile/status/update`,
        { emoji, message },
        { headers: getAuthApiHeaders() }
      );

      setMessage(null);
      setEmoji(null);
      setShowEditStatusModal(false);
      queryClient.invalidateQueries({
        queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY]
      });
      toast.success("Profile status updated");
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div className="space-y-5 p-5">
      <div>
        <Input
          placeholder="Status"
          value={message || ""}
          onChange={(e) => setMessage(e.target.value)}
          error={(message || "")?.length > 80}
          prefix={
            <div className={cn(emoji ? "mx-0.5" : "mt-1.5")}>
              <EmojiPicker
                emoji={emoji}
                setEmoji={(emoji: string) => {
                  setShowEmojiPicker(false);
                  setEmoji(emoji);
                }}
                setShowEmojiPicker={setShowEmojiPicker}
                showEmojiPicker={showEmojiPicker}
              />
            </div>
          }
        />
        {(message || "")?.length > 70 && (
          <b className="mt-2 text-red-500 text-sm">
            {80 - (message || "").length} characters left
          </b>
        )}
      </div>
      <div className="flex w-full items-center justify-between space-x-2">
        <Button className="w-full" variant="danger" onClick={handleClear}>
          Clear Status
        </Button>
        <Button className="w-full" onClick={handleUpdate}>
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default AccountStatus;
