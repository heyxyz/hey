import errorToast from "@helpers/errorToast";
import { useJoinGroupMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import toast from "react-hot-toast";

interface JoinProps {
  address: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ address, setJoined, small }) => {
  const [joinGroup, { loading }] = useJoinGroupMutation();

  const handleJoin = async () => {
    try {
      await joinGroup({ variables: { request: { group: address } } });
      setJoined(true);
      toast.success("Joined group");
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Button
      aria-label="Join"
      disabled={loading}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      Join
    </Button>
  );
};

export default Join;
