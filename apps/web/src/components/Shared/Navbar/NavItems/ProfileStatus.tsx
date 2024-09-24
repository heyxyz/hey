import { FaceSmileIcon } from "@heroicons/react/24/outline";
import getProfileDetails from "@hey/helpers/api/getProfileDetails";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface ProfileStatusProps {
  id: string;
  className?: string;
}

const ProfileStatus: FC<ProfileStatusProps> = ({ id, className = "" }) => {
  const { setShowEditStatusModal } = useGlobalModalStateStore();

  const { data: profileDetails, isLoading: profileDetailsLoading } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getProfileDetails(id),
    queryKey: ["getProfileDetailsOnProfile", id]
  });

  return (
    <button
      className={cn(
        "flex w-full items-center space-x-2 px-2 py-1.5 text-left text-gray-700 text-sm focus:outline-none dark:text-gray-200",
        className
      )}
      onClick={() => setShowEditStatusModal(true)}
      type="button"
    >
      {profileDetailsLoading ? (
        <>
          {/* TODO: Fix to use proper size-5 */}
          <div className="shimmer h-5 w-6 rounded-full" />
          <div className="shimmer h-4 w-full rounded-md" />
        </>
      ) : profileDetails?.status ? (
        <>
          <span>{profileDetails.status.emoji}</span>
          <span>{profileDetails.status.message}</span>
        </>
      ) : (
        <>
          <FaceSmileIcon className="size-4" />
          <span>Set Status</span>
        </>
      )}
    </button>
  );
};

export default ProfileStatus;
