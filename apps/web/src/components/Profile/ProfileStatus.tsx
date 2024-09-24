import getProfileDetails from "@hey/helpers/api/getProfileDetails";
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
    queryKey: ["getProfileStatus", id]
  });

  if (!data?.status) {
    return null;
  }

  return (
    <Tooltip content={data.status.message}>
      <span className="cursor-default text-lg">{data.status.emoji}</span>
    </Tooltip>
  );
};

export default ProfileStatus;
