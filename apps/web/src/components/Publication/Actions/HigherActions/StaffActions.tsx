import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import {
  ChatBubbleLeftIcon,
  ExclamationCircleIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalProfile from "@hey/helpers/api/getInternalProfile";
import type { MirrorablePublication } from "@hey/lens";
import { Button } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface StaffActionsProps {
  onClick?: () => void;
  publication: MirrorablePublication;
}

const StaffActions: FC<StaffActionsProps> = ({ onClick, publication }) => {
  const isStaff = useFlag(FeatureFlag.Staff);

  const { data: profile } = useQuery({
    queryFn: () => getInternalProfile(publication.by.id, getAuthApiHeaders()),
    queryKey: ["getInternalProfile", publication.by.id || ""],
    enabled: isStaff
  });

  if (!isStaff) {
    return null;
  }

  const updateFeatureFlag = (id: string) => {
    onClick?.();
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/permissions/assign`,
        { enabled: true, id, profile_id: publication.by.id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: "Error suspending profile",
        loading: "Suspending profile...",
        success: "Profile suspended"
      }
    );
  };

  const hasSuspendWarning = profile?.permissions.includes(
    Permission.SuspendWarning
  );
  const isSuspended = profile?.permissions.includes(Permission.Suspended);
  const isCommentSuspended = profile?.permissions.includes(
    Permission.CommentSuspended
  );

  return (
    <>
      <Button
        className="flex justify-center"
        icon={<ExclamationCircleIcon className="size-4" />}
        onClick={() => updateFeatureFlag(PermissionId.SuspendWarning)}
        disabled={isSuspended || hasSuspendWarning}
        size="sm"
        variant="danger"
        outline
      >
        Warn Profile
      </Button>
      <Button
        className="flex justify-center"
        icon={<ChatBubbleLeftIcon className="size-4" />}
        onClick={() => updateFeatureFlag(PermissionId.CommentSuspended)}
        disabled={isSuspended || isCommentSuspended}
        size="sm"
        variant="danger"
      >
        Comment Suspend
      </Button>
      <Button
        className="flex justify-center"
        icon={<NoSymbolIcon className="size-4" />}
        onClick={() => updateFeatureFlag(PermissionId.Suspended)}
        disabled={isSuspended}
        size="sm"
        variant="danger"
      >
        Profile Suspend
      </Button>
    </>
  );
};

export default StaffActions;
