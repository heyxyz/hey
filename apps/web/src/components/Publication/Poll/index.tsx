import Wrapper from "@components/Shared/Embed/Wrapper";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import type { Poll as TPoll } from "@hey/types/hey";
import { Spinner } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import Choices from "./Choices";

interface SnapshotProps {
  id: string;
}

const Poll: FC<SnapshotProps> = ({ id }) => {
  const getPoll = async (): Promise<null | TPoll> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/polls/get`, {
        headers: { ...getAuthApiHeaders(), "X-Skip-Cache": true },
        params: { id }
      });
      const { data } = response;

      return data?.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getPoll,
    queryKey: ["getPoll", id]
  });

  if (isLoading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.id || error) {
    return null;
  }

  return <Choices poll={data} />;
};

export default Poll;
