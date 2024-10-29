import getProfileDetails, {
  GET_PROFILE_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getProfileDetails";
import { Tooltip } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface ProfileStatusProps {
  id: string;
}

const ProfileStatus: FC<ProfileStatusProps> = ({ id }) => {
  const { data } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getProfileDetails(id),
    queryKey: [GET_PROFILE_DETAILS_QUERY_KEY, id]
  });

  if (!data?.status) {
    return null;
  }

  if (!data.status.message) {
    return <span className="cursor-default text-lg">{data.status.emoji}</span>;
  }

  return (
    <Tooltip content={data.status.message}>
      <span className="cursor-default text-lg">{data.status.emoji}</span>
    </Tooltip>
  );
};

export default ProfileStatus;
