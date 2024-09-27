import { StarIcon } from "@heroicons/react/24/solid";
import getProfileDetails from "@hey/helpers/api/getProfileDetails";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface ProProps {
  id: string;
  iconClassName?: string;
}

const Pro: FC<ProProps> = ({ id, iconClassName = "" }) => {
  const { data } = useQuery({
    queryFn: () => getProfileDetails(id),
    queryKey: ["getProfileDetails", id]
  });

  if (!data?.pro?.isPro) {
    return null;
  }

  return (
    <Tooltip content="Pro">
      <StarIcon className={cn("size-6 text-yellow-500", iconClassName)} />
    </Tooltip>
  );
};

export default Pro;
