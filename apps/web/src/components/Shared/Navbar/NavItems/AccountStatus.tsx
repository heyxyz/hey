import { FaceSmileIcon } from "@heroicons/react/24/outline";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface AccountStatusProps {
  id: string;
  className?: string;
}

const AccountStatus: FC<AccountStatusProps> = ({ id, className = "" }) => {
  const { setShowEditStatusModal } = useGlobalModalStateStore();

  const { data, isLoading } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getAccountDetails(id),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, id]
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
      {isLoading ? (
        <>
          {/* TODO: Fix to use proper size-5 */}
          <div className="shimmer h-5 w-6 rounded-full" />
          <div className="shimmer h-4 w-full rounded-md" />
        </>
      ) : data?.status ? (
        <>
          <span>{data.status.emoji}</span>
          <span className="truncate">
            {data.status.message || "Set Status"}
          </span>
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

export default AccountStatus;
