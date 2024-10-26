import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Button } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface JoinProps {
  id: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ id, setJoined, small }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/clubs/join`,
        { id },
        { headers: getAuthApiHeaders() }
      );

      setJoined(true);
      toast.success("Joined club");
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Join"
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      Join
    </Button>
  );
};

export default Join;
