import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import getProfileDetails from "@hey/helpers/api/getProfileDetails";
import { Button, ErrorMessage, Input } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import EmojiPicker from "../EmojiPicker";

const ProfileStatus: FC = () => {
  const { currentProfile } = useProfileStore();
  const { setShowEditStatusModal } = useGlobalModalStateStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);

  const { isLoading, error } = useQuery({
    enabled: Boolean(currentProfile?.id),
    queryFn: () =>
      getProfileDetails(currentProfile?.id).then((data) => {
        setMessage(data?.status?.message || null);
        setEmoji(data?.status?.emoji || null);
        return data;
      }),
    queryKey: ["getCurrentProfileStatus", currentProfile?.id]
  });

  if (isLoading) {
    return <ProfileListShimmer />;
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
    toast.promise(
      axios.post(`${HEY_API_URL}/profile/status/clear`, undefined, {
        headers: getAuthApiHeaders()
      }),
      {
        error: "Error clearing profile status",
        loading: "Clearing profile status...",
        success: () => {
          setMessage(null);
          setEmoji(null);
          setShowEditStatusModal(false);
          return "Profile status cleared successfully";
        }
      }
    );
  };

  const handleUpdate = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/profile/status/update`,
        { emoji, message },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: "Error updating profile status",
        loading: "Updating profile status...",
        success: () => {
          setMessage(null);
          setEmoji(null);
          setShowEditStatusModal(false);
          return "Profile status updated successfully";
        }
      }
    );
  };

  return (
    <div className="space-y-5 p-5">
      <Input
        placeholder="Status"
        value={message || ""}
        onChange={(e) => setMessage(e.target.value)}
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

export default ProfileStatus;
