import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import {
  ChatBubbleLeftIcon,
  ExclamationCircleIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PermissionId } from "@hey/data/permissions";
import type { MirrorablePublication } from "@hey/lens";
import { Button } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface SuspendButtonsProps {
  onClick?: () => void;
  publication: MirrorablePublication;
}

const SuspendButtons: FC<SuspendButtonsProps> = ({ onClick, publication }) => {
  const isStaff = useFlag(FeatureFlag.Staff);

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

  return (
    <>
      <Button
        className="flex justify-center"
        icon={<ExclamationCircleIcon className="size-4" />}
        onClick={() => updateFeatureFlag(PermissionId.SuspendWarning)}
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
        size="sm"
        variant="danger"
      >
        Comment Suspend
      </Button>
      <Button
        className="flex justify-center"
        icon={<NoSymbolIcon className="size-4" />}
        onClick={() => updateFeatureFlag(PermissionId.Suspended)}
        size="sm"
        variant="danger"
      >
        Profile Suspend
      </Button>
    </>
  );
};

export default SuspendButtons;
