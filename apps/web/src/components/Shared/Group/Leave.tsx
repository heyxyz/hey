import errorToast from "@helpers/errorToast";
import { useLeaveGroupMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import toast from "react-hot-toast";

interface LeaveProps {
  address: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ address, setJoined, small }) => {
  const [leaveGroup, { loading }] = useLeaveGroupMutation();

  const handleLeave = async () => {
    try {
      await leaveGroup({ variables: { request: { group: address } } });
      setJoined(false);
      toast.success("Left group");
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Button
      aria-label="Joined"
      disabled={loading}
      onClick={handleLeave}
      outline
      size={small ? "sm" : "md"}
    >
      Joined
    </Button>
  );
};

export default Leave;
