import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { ChatBubbleLeftIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalAccount, {
  GET_INTERNAL_ACCOUNT_QUERY_KEY
} from "@hey/helpers/api/getInternalAccount";
import type { MirrorablePublication } from "@hey/lens";
import { Button } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface StaffActionsProps {
  onClick?: () => void;
  post: MirrorablePublication;
}

const StaffActions: FC<StaffActionsProps> = ({ onClick, post }) => {
  const isStaff = useFlag(FeatureFlag.Staff);

  const { data: account } = useQuery({
    queryFn: () => getInternalAccount(post.by.id, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, post.by.id || ""],
    enabled: isStaff
  });

  if (!isStaff) {
    return null;
  }

  const handleSuspendAccount = (id: string) => {
    onClick?.();
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/permissions/assign`,
        { enabled: true, id, accountId: post.by.id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: "Error suspending account",
        loading: "Suspending account...",
        success: "Account suspended"
      }
    );
  };

  const isSuspended = account?.permissions.includes(Permission.Suspended);
  const isCommentSuspended = account?.permissions.includes(
    Permission.CommentSuspended
  );

  return (
    <>
      <Button
        className="flex justify-center"
        icon={<ChatBubbleLeftIcon className="size-4" />}
        onClick={() => handleSuspendAccount(PermissionId.CommentSuspended)}
        disabled={isSuspended || isCommentSuspended}
        size="sm"
        variant="danger"
      >
        Comment Suspend
      </Button>
      <Button
        className="flex justify-center"
        icon={<NoSymbolIcon className="size-4" />}
        onClick={() => handleSuspendAccount(PermissionId.Suspended)}
        disabled={isSuspended}
        size="sm"
        variant="danger"
      >
        Account Suspend
      </Button>
    </>
  );
};

export default StaffActions;
